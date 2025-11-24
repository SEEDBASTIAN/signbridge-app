import { useEffect, useRef, useState, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import '../utils/tfjs-compat';

/**
 * useTfjsClassifier
 * Carga un modelo TFJS (GraphModel) optimizado para web con cuantización uint8.
 * - Espera input shape: [batch, 24, 126]
 * - Normalización: ya aplicada en el hook de MediaPipe
 * - Labels: se cargan desde /labels.json o prop.
 * - Usa GraphModel por defecto (más rápido y optimizado)
 */
export function useTfjsClassifier({ labelsUrl = '/labels.json', modelUrl = '/model/model.json', useGraphModel = true } = {}) {
  const [ready, setReady] = useState(false);
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState(null);
  const modelRef = useRef(null);
  const isGraphModelRef = useRef(useGraphModel);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log('[useTfjsClassifier] Iniciando carga de modelo y labels...');

        // Cargar labels - intenta múltiples rutas
        let res, data;
        const labelPaths = [labelsUrl, './labels.json', '../public/labels.json', 'labels.json'];

        for (const path of labelPaths) {
          try {
            res = await fetch(path);
            if (res.ok) {
              data = await res.json();
              const classes = Array.isArray(data) ? data : data.classes;
              if (mounted) {
                setLabels(classes || []);
                console.log('[useTfjsClassifier] Labels cargados desde:', path, `(${classes?.length} clases)`);
              }
              break;
            }
          } catch (e) {
            console.debug(`[useTfjsClassifier] No se encontraron labels en ${path}`);
          }
        }

        // Cargar modelo - intenta múltiples rutas
        const modelPaths = [modelUrl, './model/model.json', '../public/model/model.json', 'model/model.json'];
        let modelLoaded = false;

        for (const path of modelPaths) {
          try {
            console.log(`[useTfjsClassifier] Intentando cargar modelo desde: ${path}`);
            const model = useGraphModel
              ? await tf.loadGraphModel(path)
              : await tf.loadLayersModel(path);
            modelRef.current = model;
            modelLoaded = true;
            if (mounted) {
              setReady(true);
              setError(null);
              console.log('[useTfjsClassifier] Modelo cargado exitosamente desde:', path);
              console.log('[useTfjsClassifier] Tipo de modelo:', useGraphModel ? 'GraphModel' : 'LayersModel');
            }
            break;
          } catch (e) {
            console.warn(`[useTfjsClassifier] Error cargando desde ${path}:`, e.message);
          }
        }

        if (!modelLoaded && mounted) {
          const errorMsg = 'Modelo no encontrado. El SavedModel necesita ser convertido a formato TensorFlow.js. Consulta README para instrucciones.';
          setError(errorMsg);
          console.error('[useTfjsClassifier] Rutas intentadas:', modelPaths);
          console.error('[useTfjsClassifier] Error final:', errorMsg);
          console.error('[useTfjsClassifier] NOTA: Ejecuta el script de conversión en el directorio de entrenamiento');
        }
      } catch (e) {
        console.error('[useTfjsClassifier] Error al cargar:', e);
        if (mounted) setError(e.message);
      }
    })();
    return () => { mounted = false; };
  }, [labelsUrl, modelUrl]);

  const classify = useCallback(async (sequence24x126) => {
    if (!ready || !modelRef.current) return { label: 'Cargando modelo…', confidence: 0 };
    // sequence24x126: Array(24) de Array(126)
    try {
      const input = tf.tensor(sequence24x126).expandDims(0); // [1,24,126]
      let logits;

      if (isGraphModelRef.current) {
        // GraphModel usa execute()
        logits = modelRef.current.execute(input);
        // execute puede devolver un tensor o un objeto/array, normalizar
        if (Array.isArray(logits)) logits = logits[0];
      } else {
        // LayersModel usa predict()
        logits = modelRef.current.predict(input);
      }

      const probs = (await logits.softmax().data());
      input.dispose(); if (logits.dispose) logits.dispose();
      let bestI = 0; let bestP = 0;
      probs.forEach((p, i) => { if (p > bestP) { bestP = p; bestI = i; } });
      const label = labels[bestI] || `Clase ${bestI}`;
      return { label, confidence: bestP };
    } catch (e) {
      console.error('[useTfjsClassifier] Error de inferencia:', e);
      return { label: 'Error de inferencia', confidence: 0 };
    }
  }, [ready, labels]);

  return { ready, labels, classify, error };
}

export default useTfjsClassifier;

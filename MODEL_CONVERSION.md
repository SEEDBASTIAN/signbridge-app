# Conversión del Modelo a TensorFlow.js

El modelo de SignBridge necesita ser convertido de formato Keras (.keras) a formato TensorFlow.js (model.json + shards.bin) para funcionar en el navegador.

## Estado Actual

✅ Modelo entrenado: `best_model.keras` (67 clases)
✅ SavedModel generado: `public/model/saved_model/`
✅ Labels actualizados: `public/model/label_encoder.json`
❌ **PENDIENTE**: Conversión a formato TensorFlow.js

## Opción 1: Usar Google Colab (Recomendado)

1. Abre este notebook en Colab: [TensorFlow.js Converter](https://colab.research.google.com/)

2. Ejecuta este código:

```python
!pip install tensorflow==2.20.0 tensorflowjs

# Subir tu archivo best_model.keras
from google.colab import files
uploaded = files.upload()

# Convertir
import tensorflowjs as tfjs
import tensorflow as tf

model = tf.keras.models.load_model('best_model.keras')
tfjs.converters.save_keras_model(model, 'model_tfjs')

# Descargar archivos generados
!zip -r model_tfjs.zip model_tfjs
files.download('model_tfjs.zip')
```

3. Descomprime `model_tfjs.zip` y copia los archivos a `public/model/`

## Opción 2: Conversión Local (si tienes un ambiente Python limpio)

```bash
# En el directorio de entrenamiento
cd C:\Users\Sebastian_Medina\Desktop\SignBridge\EntrenamientoMovimientoHibrido\EntrenamientoMovimiento_v4

# Crear ambiente virtual limpio
python -m venv venv_conversion
venv_conversion\Scripts\activate

# Instalar dependencias
pip install tensorflow==2.20.0 tensorflowjs numpy==1.26.4

# Convertir
python convert_keras_to_tfjs.py

# Los archivos se generarán en model_tfjs/
# Copiar a: C:\Users\Sebastian_Medina\Documents\GitHub\signbridge-app\public\model\
```

## Opción 3: Convertidor Online

1. Ve a: https://www.tensorflow.org/js/tutorials/conversion/import_keras
2. Sigue las instrucciones para usar el convertidor web
3. Sube `best_model.keras`
4. Descarga los archivos convertidos
5. Cópiálos a `public/model/`

## Archivos Esperados en `public/model/`

Después de la conversión, deberías tener:

```
public/model/
├── model.json              ← Arquitectura del modelo
├── group1-shard1of1.bin   ← Pesos del modelo
├── label_encoder.json      ← 67 clases (ya existe)
└── saved_model/            ← SavedModel (ya existe)
```

## Verificar que Funciona

1. Hacer commit y push
2. Netlify desplegará automáticamente
3. Abrir https://signbridge-app.netlify.app/
4. Ir a "Detectar"
5. Debe mostrar "Modelo: ✓ OK"

## Solución de Problemas

### Error: "Modelo no encontrado"
- Verifica que `model.json` esté en `public/model/`
- Abre la consola del navegador (F12) y busca errores

### Error: "Failed to fetch"
- Netlify puede estar bloqueando archivos grandes
- Verifica en Netlify → Asset Optimization que no esté minificando .bin files

### Error: "Input shape mismatch"
- El modelo espera: [batch, 24, 126]
- Verifica que MediaPipe esté generando 126 features (2 manos × 21 landmarks × 3 coords)

## Modelo Actual

- **Input**: [batch, 24, 126] - 24 frames de 126 features (manos)
- **Output**: [batch, 67] - 67 clases
- **Clases**: 0-9, A-Z, 32 frases comunes
- **Arquitectura**: Bidirectional LSTM con Masking
- **Framework**: Keras 3.x / TensorFlow 2.20

🤖 Generated with [Claude Code](https://claude.com/claude-code)

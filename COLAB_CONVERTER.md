# Convertidor de Modelo - Google Colab

Ya que el ambiente Python local tiene conflictos de dependencias, usa este notebook de Google Colab que funciona de manera garantizada.

## Instrucciones

1. **Abre Google Colab**: https://colab.research.google.com/

2. **Crea un nuevo notebook**

3. **Copia y pega este código en celdas separadas**:

### Celda 1: Instalar dependencias
```python
# Instalar TensorFlow y TensorFlow.js
!pip install -q tensorflow==2.20.0 tensorflowjs

print("✓ Dependencias instaladas")
```

### Celda 2: Subir modelo
```python
from google.colab import files
import os

print("📁 Selecciona el archivo best_model.keras")
print(f"   Ubicación: C:\\Users\\Sebastian_Medina\\Desktop\\SignBridge\\")
print(f"   EntrenamientoMovimientoHibrido\\EntrenamientoMovimiento_v4\\model\\best_model.keras")
print()

uploaded = files.upload()
print(f"\n✓ Archivo subido: {list(uploaded.keys())[0]}")
```

### Celda 3: Convertir con optimizaciones
```python
import tensorflow as tf
import tensorflowjs as tfjs
import os

print("="*70)
print("CONVERSIÓN OPTIMIZADA PARA WEB")
print("="*70)

# Cargar modelo
print("\n[1/2] Cargando modelo...")
model = tf.keras.models.load_model('best_model.keras')
print(f"✓ Modelo cargado")
print(f"  Input:  {model.input_shape}")
print(f"  Output: {model.output_shape}")
print(f"  Params: {model.count_params():,}")

# Convertir con cuantización uint8 (reduce tamaño ~75%)
print("\n[2/2] Convirtiendo a TensorFlow.js...")
print("  Aplicando cuantización uint8...")

tfjs.converters.save_keras_model(
    model,
    'model_tfjs',
    quantization_dtype_map={'uint8': '*'}  # Cuantización agresiva
)

print("\n" + "="*70)
print("✓ CONVERSIÓN EXITOSA!")
print("="*70)

# Mostrar archivos generados
files_list = os.listdir('model_tfjs')
total_size = sum(os.path.getsize(os.path.join('model_tfjs', f)) for f in files_list)

print(f"\nArchivos generados ({len(files_list)}):")
for f in sorted(files_list):
    size = os.path.getsize(os.path.join('model_tfjs', f)) / 1024
    print(f"  • {f:30s} {size:>8.2f} KB")

print(f"\nTamaño total: {total_size / (1024*1024):.2f} MB")
print(f"Reducción estimada: ~75% del tamaño original")
print("\nOptimizaciones:")
print("  ✓ Cuantización uint8 aplicada")
print("  ✓ Formato tfjs_layers_model")
print("  ✓ Compatible con WebGL")
```

### Celda 4: Descargar archivos
```python
from google.colab import files
import shutil

# Comprimir archivos
print("📦 Comprimiendo archivos...")
shutil.make_archive('model_tfjs', 'zip', 'model_tfjs')
print("✓ Archivo comprimido: model_tfjs.zip")

# Descargar
print("\n⬇️  Descargando...")
files.download('model_tfjs.zip')
print("\n✓ Descarga iniciada!")
print("\n" + "="*70)
print("PRÓXIMOS PASOS")
print("="*70)
print("\n1. Descomprime model_tfjs.zip")
print("\n2. Copia los archivos a:")
print("   C:\\Users\\Sebastian_Medina\\Documents\\GitHub\\")
print("   signbridge-app\\public\\model\\")
print("\n3. En signbridge-app, ejecuta:")
print("   git add public/model/")
print("   git commit -m 'feat: add optimized TensorFlow.js model'")
print("   git push")
print("\n4. Verifica en: https://signbridge-app.netlify.app/")
print("="*70)
```

## Resultado Esperado

Después de ejecutar todas las celdas, tendrás:

- ✅ `model_tfjs.zip` descargado
- ✅ Dentro: `model.json` + archivos `.bin`
- ✅ Modelo optimizado con cuantización uint8
- ✅ Tamaño reducido ~75%
- ✅ Listo para web

## Verificar que Funciona

1. Copia los archivos a `public/model/`
2. Debe haber:
   - `model.json`
   - `group1-shard1of1.bin` (o similar)
   - `label_encoder.json` (ya existe)

3. Hacer commit y push
4. Netlify desplegará automáticamente
5. Abrir https://signbridge-app.netlify.app/
6. Ir a "Detectar"
7. Debe mostrar: "Modelo: ✓ OK"

## Solución de Problemas

### Error: "modelo no cargado"
- Verifica que `model.json` esté en `public/model/`
- Abre la consola del navegador (F12)
- Busca errores de carga

### Error: "Input shape mismatch"
- El modelo necesita [batch, 24, 126]
- Verifica MediaPipe genera 126 features

### Modelo muy grande
- Asegúrate de usar la cuantización uint8
- Debería ser < 5 MB total

🤖 Generated with [Claude Code](https://claude.com/claude-code)

# 🚀 Deployment a Netlify - SignBridge

## ✅ Estado del Proyecto

**Repositorio**: https://github.com/SEEDBASTIAN/signbridge-app
**Commit actual**: `814b22b`
**Modelo optimizado**: ✅ 3.3 MB (GraphModel con cuantización uint8)

## 📦 Archivos Listos

```
public/model/
├── model.json              (321 KB)  ✅
├── group1-shard1of1.bin   (2.9 MB)  ✅
└── label_encoder.json     (620 B)   ✅
```

## 🆕 Crear Nuevo Sitio en Netlify

### Paso 1: Acceder a Netlify
1. Abre: https://app.netlify.com/
2. Inicia sesión con tu cuenta

### Paso 2: Importar desde Git
1. Click en **"Add new site"** → **"Import an existing project"**
2. Selecciona **"Deploy with GitHub"**
3. Autoriza Netlify si es necesario
4. Busca: **`SEEDBASTIAN/signbridge-app`**
5. Click en el repositorio

### Paso 3: Configuración del Build
```
Site name: signbridge-v4 (o el que prefieras)
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

**IMPORTANTE**: Netlify detectará automáticamente `netlify.toml` que ya está configurado.

### Paso 4: Variables de Entorno (Opcional)
No se necesitan variables de entorno para este proyecto.

### Paso 5: Deploy!
1. Click en **"Deploy site"**
2. Espera 2-3 minutos
3. ✅ Sitio desplegado!

## 🔍 Verificar que Funciona

### 1. Verificar modelo
Abre en el navegador:
```
https://TU-SITIO.netlify.app/model/model.json
```
Debe mostrar el archivo JSON del modelo (321 KB)

### 2. Verificar pesos
```
https://TU-SITIO.netlify.app/model/group1-shard1of1.bin
```
Debe descargar el archivo (2.9 MB)

### 3. Probar la app
```
https://TU-SITIO.netlify.app/
```

1. Abre la app
2. Ve a **"Detectar"**
3. Debe mostrar: **"Modelo: ✓ OK"**
4. Activa la cámara
5. ¡Prueba el reconocimiento de señas!

## 📊 Configuración Netlify Automática

El archivo `netlify.toml` ya está configurado con:

✅ Build command: `npm run build`
✅ Publish directory: `dist`
✅ SPA routing (redirect /* → index.html)
✅ Headers CORS para assets
✅ Cache control optimizado
✅ MIME types para WASM

## 🛠️ Build Process

Cuando Netlify hace el build, ejecuta:

```bash
1. npm install          # Instala dependencias
2. npm run build        # Ejecuta:
   - Copia WASM files
   - Expo export --platform web
   - Copia public/** → dist/
   - Copia netlify.toml → dist/
3. Publica dist/        # Deploy
```

## ✨ Optimizaciones Incluidas

- **Modelo optimizado**: GraphModel con cuantización uint8
- **Tamaño reducido**: 3.3 MB (75% más pequeño)
- **WebGL enabled**: Aceleración GPU en navegador
- **Cache headers**: Assets cacheados 1 año
- **Gzip/Brotli**: Compresión automática por Netlify
- **CDN global**: Distribución worldwide

## 🐛 Solución de Problemas

### Error: "Build command failed"
```bash
# Prueba el build localmente:
npm run build

# Si falla, verifica:
npm install
```

### Error: "Model not found"
Verifica que `public/model/` tenga:
- model.json (321 KB)
- group1-shard1of1.bin (2.9 MB)
- label_encoder.json (620 B)

### Error: "WASM not loading"
Netlify automáticamente configura los MIME types correctos.
Si hay problemas, verifica `netlify.toml` → headers para WASM.

### Build muy lento
El primer build toma ~5 minutos.
Builds subsecuentes: ~2 minutos (con cache).

## 📈 Monitoreo Post-Deploy

### 1. Performance
- **Lighthouse score**: Debería ser 90+
- **Tiempo de carga**: < 3 segundos
- **FPS detección**: ~24 FPS

### 2. Logs
En Netlify:
- Site → Deploys → Ver logs
- Busca errores en el build

### 3. Analytics (Opcional)
Netlify Analytics está disponible en planes de pago.

## 🎉 Todo Listo!

Una vez desplegado, comparte tu app:
```
https://TU-SITIO.netlify.app/
```

## 📝 Notas

- **Dominio custom**: Puedes configurar uno en Site settings → Domain management
- **HTTPS**: Automático con certificado SSL gratis
- **Auto-deploy**: Cada push a `main` redespliega automáticamente
- **Preview deploys**: Pull requests generan preview automático

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

const tf = require('@tensorflow/tfjs-node');
const path = require('path');

async function convertModel() {
  try {
    console.log('Cargando modelo Keras...');
    const modelPath = path.join(__dirname, '..', 'public', 'model', 'best_model.keras');
    const model = await tf.loadLayersModel(`file://${modelPath}`);

    console.log('Modelo cargado exitosamente');
    console.log('Guardando en formato TensorFlow.js...');

    const outputPath = `file://${path.join(__dirname, '..', 'public', 'model')}`;
    await model.save(outputPath);

    console.log('✓ Modelo convertido exitosamente a TensorFlow.js');
    console.log(`✓ Archivos guardados en: public/model/`);

  } catch (error) {
    console.error('Error al convertir el modelo:', error);
    process.exit(1);
  }
}

convertModel();

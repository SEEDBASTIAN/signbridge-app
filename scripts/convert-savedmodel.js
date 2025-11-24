const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs');

async function convertSavedModel() {
  try {
    console.log('='.repeat(70));
    console.log('CONVERSIÓN DE SAVEDMODEL A TENSORFLOW.JS');
    console.log('='.repeat(70));

    const savedModelPath = path.join(__dirname, '..', 'public', 'model', 'saved_model');
    const outputPath = path.join(__dirname, '..', 'public', 'model');

    console.log('\nInput:', savedModelPath);
    console.log('Output:', outputPath);

    // Cargar el SavedModel
    console.log('\nCargando SavedModel...');
    const model = await tf.node.loadSavedModel(savedModelPath, ['serve'], 'serving_default');

    console.log('Modelo cargado exitosamente');

    // Guardar como graph model de TensorFlow.js
    console.log('\nGuardando como TensorFlow.js Graph Model...');
    await model.save(`file://${outputPath}`);

    console.log('\n' + '='.repeat(70));
    console.log('CONVERSIÓN COMPLETADA');
    console.log('='.repeat(70));

    // Listar archivos generados
    const files = fs.readdirSync(outputPath);
    const modelFiles = files.filter(f => f.startsWith('model.json') || f.includes('.bin'));

    console.log(`\nArchivos generados (${modelFiles.length}):`);
    modelFiles.forEach(f => {
      const stats = fs.statSync(path.join(outputPath, f));
      console.log(`  - ${f} (${(stats.size / 1024).toFixed(2)} KB)`);
    });

    console.log('\n' + '='.repeat(70));

  } catch (error) {
    console.error('\nERROR durante la conversión:', error);
    process.exit(1);
  }
}

convertSavedModel();

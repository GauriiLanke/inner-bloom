const { spawn } = require('child_process');
const path = require('path');

/**
 * Predicts PCOS risk using the Python ML model.
 * @param {Object} assessmentData 
 * @returns {Promise<{riskLevel: string, confidence: number}>}
 */
function predictPcosRisk(assessmentData) {
  return new Promise((resolve, reject) => {
    // Determine the path to the python predictor script
    const predictorScript = path.resolve(__dirname, '../../ml-model/predictor.py');
    
    // Convert assessment payload to format expected by predictor
    const formattedData = {
      Age: assessmentData.personal?.age || 25,
      BMI: calculateBMI(assessmentData.personal?.weightKg, assessmentData.personal?.heightCm),
      Cycle_Regularity: assessmentData.menstrual?.cycleRegularity || 'Irregular',
      Acne: assessmentData.symptoms?.acne ? 'True' : 'False',
      Hair_Loss: assessmentData.symptoms?.hairLoss ? 'True' : 'False',
      Weight_Gain: assessmentData.symptoms?.weightGain ? 'True' : 'False',
      Sleep_Hours: assessmentData.lifestyle?.sleepHours || 7,
      Stress_Level: assessmentData.lifestyle?.stressLevel || 'Medium',
      Exercise_Frequency: assessmentData.lifestyle?.exerciseFrequency || 'Never',
      Family_History: assessmentData.familyHistory?.pcosHistory || 'No'
    };

    // Execute python script
    const pythonProcess = spawn('python', [predictorScript], { shell: true });
    
    let resultData = '';
    let errorData = '';

    // Pass data via stdin
    pythonProcess.stdin.write(JSON.stringify(formattedData));
    pythonProcess.stdin.end();

    // Read stdout
    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    // Read stderr
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python process exited with code ${code}: ${errorData}`));
      }
      try {
        const result = JSON.parse(resultData);
        if (result.error) {
          return reject(new Error(result.error));
        }
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse prediction output: ${resultData}`));
      }
    });

    pythonProcess.on('error', (err) => {
      console.error('Failed to start Python process:', err);
      reject(err);
    });
  });
}

function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return 22.0; // Fallback normal BMI
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(2));
}

module.exports = { predictPcosRisk };

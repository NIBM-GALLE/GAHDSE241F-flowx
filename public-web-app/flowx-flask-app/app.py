from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os
import logging

#initialize Flask app
app = Flask(__name__)
CORS(app)

#configure logging
logging.basicConfig(level=logging.DEBUG)
app.logger.debug("Flask app initialized")

#get absolute path of the current script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")

#load models with error handling
models = {}
model_files = {
    "flood_safe_area": "gbr_flood_safe_area_model.pkl",
    "flood_area": "gbr_flood_area_model.pkl",
    "flood_percentage_rf": "flood_precentage_random_forest_model.pkl",
    "flood_prediction_lr": "flood_prediction_logistic_regression_model.pkl",
    "recover_days_xgbr": "recover_days_XGBR_model.pkl"
}

try:
    for name, filename in model_files.items():
        model_path = os.path.join(MODELS_DIR, filename)
        app.logger.debug(f"Loading model: {model_path}")
        models[name] = joblib.load(model_path)
    app.logger.debug("All models loaded successfully")
except Exception as e:
    app.logger.error(f"Error loading models: {str(e)}")
    raise e

@app.route('/')
def home():
    return "Flood Prediction API is running!"

@app.route('/predict/<model_name>', methods=['POST'])
def predict(model_name):
    if model_name not in models:
        app.logger.error(f"Model not found: {model_name}")
        return jsonify({"error": "Model not found"}), 404

    try:
        data = request.json
        app.logger.debug(f"Received data: {data}")
        
        if "features" not in data:
            raise ValueError("Missing 'features' in request data")
            
        features = np.array(data["features"]).reshape(1, -1)
        prediction = models[model_name].predict(features)
        
        response = {
            "model": model_name,
            "prediction": prediction.tolist(),
            "status": "success"
        }
        app.logger.debug(f"Prediction response: {response}")
        
        return jsonify(response)
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": str(e), "status": "error"}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
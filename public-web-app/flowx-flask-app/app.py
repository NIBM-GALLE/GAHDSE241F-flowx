from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app) 

# Get absolute path of the current script (app.py)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load the trained models 
models = {
    "flood_safe_area": joblib.load(os.path.join(BASE_DIR, "models", "gbr_flood_safe_area_model.pkl")),
    "flood_area": joblib.load(os.path.join(BASE_DIR, "models", "gbr_flood_area_model.pkl")),
    "flood_percentage_rf": joblib.load(os.path.join(BASE_DIR, "models", "flood_precentage_random_forest_model.pkl")),
    "flood_prediction_lr": joblib.load(os.path.join(BASE_DIR, "models", "flood_prediction_logistic_regression_model.pkl")),
    "recover_days_xgbr": joblib.load(os.path.join(BASE_DIR, "models", "recover_days_XGBR_model.pkl")),
}

@app.route('/')
def home():
    return "Flood Prediction API is running!"

@app.route('/predict/<model_name>', methods=['POST'])
def predict(model_name):
    if model_name not in models:
        return jsonify({"error": "Model not found"}), 404

    try:
        data = request.json["features"]
        features = np.array(data).reshape(1, -1)
        prediction = models[model_name].predict(features)
        return jsonify({"prediction": prediction.tolist()})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)

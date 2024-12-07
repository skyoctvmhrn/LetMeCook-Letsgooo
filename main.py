import uvicorn
from fastapi import FastAPI
from keras.models import load_model
# import tensorflow as tf
import pickle
from fastapi import Body

model = load_model('model_capstone.h5')

app = FastAPI()

@app.get('/load-model')
async def index():
    return {"status": "success","message": "API Ready"}

@app.post('/predict')
async def predict(data : list[str] = Body(..., embed=True)):

    try: 
        new_ingredients = data

        print(new_ingredients)

        with open('vectorizer.pkl', 'rb') as f:
          vectorizer = pickle.load(f)

        with open('mlb1.pkl', 'rb') as f:
           mlb = pickle.load(f)

        new_ingredients_str = ' '.join(new_ingredients)  # Convert to a single string

        new_ingredients_vectorized = vectorizer.transform([new_ingredients_str])  # Transform to sparse matrix

        predicted_probabilities = model.predict(new_ingredients_vectorized)

        threshold = 0.77
        predicted_tags_binary = (predicted_probabilities > threshold).astype(int)

        predicted_tags = mlb.inverse_transform(predicted_tags_binary)

        print("Predicted Tags:", predicted_tags)

        return {"status": "success","message": "Prediction successfully","data":predicted_tags[0] }
            
    except Exception as e:
        return {"status": "error","message": e.args}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
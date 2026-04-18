import os
import pandas as pd
from flask import Flask, request, jsonify, render_template
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# Global variables for model
df = None
cosine_sim = None

def load_data_and_model():
    global df, cosine_sim
    print("Loading data and computing similarity matrix...")
    # Read the dataset
    data_url = 'https://raw.githubusercontent.com/rashida048/Some-NLP-Projects/refs/heads/master/movie_dataset.csv'
    local_path = 'data/processed_movie_data.csv'
    
    # Try local first to speed up restarts
    if os.path.exists(local_path):
        df = pd.read_csv(local_path)
    else:
        print(f"Downloading dataset from {data_url}...")
        df = pd.read_csv(data_url)
        # Ensure data directory exists
        os.makedirs('data', exist_ok=True)
        # Save a local snippet
        df.to_csv(local_path, index=False)

    # Preprocessing
    features = ['keywords', 'cast', 'genres', 'director']
    for feature in features:
        df[feature] = df[feature].fillna('')
        
    def combine_features(row):
        return str(row['keywords']) + " " + str(row['cast']) + " " + str(row['genres']) + " " + str(row['director'])
        
    df["combined_features"] = df.apply(combine_features, axis=1)
    
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(df["combined_features"])
    cosine_sim = cosine_similarity(count_matrix)
    print("Model ready!")

# Initialize the model right away
load_data_and_model()

def get_index_from_title(title):
    return df[df.title.str.lower() == title.lower()]["index"].values[0]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/movies', methods=['GET'])
def get_movies():
    # Return a list of all movie titles for the search autocomplete
    movies = df['title'].dropna().astype(str).tolist()
    return jsonify(movies)

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    movie_user_likes = data.get('movie', '').strip()
    
    if not movie_user_likes:
        return jsonify({"error": "No movie provided"}), 400
        
    try:
        movie_index = get_index_from_title(movie_user_likes)
    except IndexError:
        return jsonify({"error": "Movie not found in dataset. Please check the spelling!"}), 404
        
    similar_movies = list(enumerate(cosine_sim[movie_index]))
    sorted_similar_movies = sorted(similar_movies, key=lambda x:x[1], reverse=True)[1:11]
    
    recommendations = []
    for i in range(10):
        index = sorted_similar_movies[i][0]
        row = df.iloc[index]
        
        recommendations.append({
            "title": str(row['title']),
            "genres": str(row['genres']) if pd.notna(row['genres']) else "Unknown",
            "director": str(row['director']) if pd.notna(row['director']) else "Unknown",
            "vote_average": round(float(row['vote_average']), 1) if pd.notna(row['vote_average']) else 0.0,
            "release_date": str(row['release_date']).split('-')[0] if pd.notna(row['release_date']) else "Unknown"
        })
        
    return jsonify({
        "search_term": df[df.index == movie_index]["title"].values[0],
        "recommendations": recommendations
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

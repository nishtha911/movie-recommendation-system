# 🎬 FilmFinder

**FilmFinder** is a Machine Learning-based movie recommendation system that suggests similar movies based on what you love. It features a beautifully designed, responsive web interface for seamless personal use, and includes a well-documented Jupyter Notebook specifically tailored for academic mini-project presentations.

## ✨ Features

- **Smart Recommendations:** Uses `CountVectorizer` and `Cosine Similarity` to accurately find related movies based on cast, crew, genres, and keywords.
- **Premium User Interface:** A stunning, modern dark-themed frontend with glassmorphism effects, dynamic glow orbs, and responsive movie cards.
- **Lightning Fast Search:** Real-time autocomplete suggestions as you type to easily find your favorite movies.
- **Academic Ready:** Includes a `model_development.ipynb` notebook to easily demonstrate the machine learning workflow to instructors.

## 🛠️ Tech Stack

- **Backend:** Python, Flask
- **Machine Learning:** Scikit-Learn, Pandas, NumPy
- **Frontend:** HTML5, Vanilla CSS, Vanilla JavaScript
- **Deployment:** Ready for deployment via Gunicorn and Render.

---

## 🚀 Running Locally

### 1. Install Dependencies
Make sure you have Python installed, then install the required libraries:
```bash
pip install -r requirements.txt
```

### 2. Run the Web Application
Start the Flask server for the frontend application:
```bash
python app.py
```
After the model finishes its initial setup, open your browser and navigate to `http://127.0.0.1:5000/`.

### 3. Using the Jupyter Notebook (For Presentations)
If you need to present the backend ML logic:
1. Open the `notebooks` folder.
2. Start Jupyter (`jupyter notebook`).
3. Run through `model_development.ipynb` to show the dataset manipulation, vectorization, and the raw text output for recommendations.

---

## 🌍 Quick Deployment Guide (Render)

This project is pre-configured with a `Procfile` and `requirements.txt` for immediate deployment on Render.

1. Create a free account on [Render.com](https://render.com) and link your GitHub.
2. Click **New +** and select **Web Service**.
3. Connect the `movie-recommendation-system` repository.
4. Render will automatically detect the following (if not, fill them in):
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Click **Create Web Service**. After a few minutes, your premium FilmFinder interface will be live on the internet! 

*(Note: On the free tier, your site may take ~30 seconds to wake up if it hasn't been accessed in a while.)*

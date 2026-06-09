# Flask app — serves the React frontend and the quotes JSON API.

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__, static_folder='dist', static_url_path='')
CORS(app)

QUOTES_DB = {
    'motivational': [
        {'id': 1, 'text': 'The only way to do great work is to love what you do.'},
        {'id': 2, 'text': "Believe you can and you're halfway there."},
        {'id': 3, 'text': 'Success is not final, failure is not fatal.'},
        {'id': 4, 'text': 'It is during our darkest moments that we must focus to see the light.'},
        {'id': 5, 'text': 'The future belongs to those who believe in the beauty of their dreams.'},
    ],
    'success': [
        {'id': 6,  'text': "Don't watch the clock; do what it does. Keep going."},
        {'id': 7,  'text': 'Success is the sum of small efforts repeated day in and day out.'},
        {'id': 8,  'text': "Your limitation—it's only your imagination."},
        {'id': 9,  'text': 'Push yourself, because no one else is going to do it for you.'},
    ],
    'perseverance': [
        {'id': 10, 'text': 'Fall seven times, stand up eight.'},
        {'id': 11, 'text': 'It does not matter how slowly you go as long as you do not stop.'},
        {'id': 12, 'text': 'Everything you want is on the other side of fear.'},
    ],
    'wisdom': [
        {'id': 13, 'text': 'The only true wisdom is in knowing you know nothing.'},
        {'id': 14, 'text': 'Knowledge speaks, but wisdom listens.'},
        {'id': 15, 'text': 'In the middle of difficulty lies opportunity.'},
    ],
}

@app.route('/api/quotes')
def get_all_quotes():
    all_quotes = []
    for category, quotes in QUOTES_DB.items():
        for q in quotes:
            all_quotes.append({**q, 'category': category})
    return jsonify({'total': len(all_quotes), 'quotes': all_quotes})


@app.route('/api/quotes/category/<category>')
def get_quotes_by_category(category):
    category = category.lower()
    if category not in QUOTES_DB:
        return jsonify({
            'error': f'Category "{category}" not found',
            'available_categories': list(QUOTES_DB.keys())
        }), 404
    quotes = [{**q, 'category': category} for q in QUOTES_DB[category]]
    return jsonify({'category': category, 'total': len(quotes), 'quotes': quotes})


@app.route('/api/categories')
def get_categories():
    categories = [{'name': k, 'count': len(v)} for k, v in QUOTES_DB.items()]
    return jsonify({'categories': categories, 'total_categories': len(categories)})


@app.route('/api/info')
def app_info():
    return jsonify({
        'app': 'Quotes Application',
        'version': '1.0.0',
        'description': 'Browse inspirational quotes and categories',
        'environment': 'Docker Container',
        'timestamp': datetime.now().isoformat(),
        'total_quotes': sum(len(v) for v in QUOTES_DB.values()),
        'categories': list(QUOTES_DB.keys()),
    })


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

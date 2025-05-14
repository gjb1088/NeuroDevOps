from flask import Flask, render_template, request

app = Flask(__name__)

# Store only the latest data
latest_log = {}

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html', log=latest_log)

@app.route('/update', methods=['POST'])
def update():
    global latest_log
    latest_log = {
        'metrics': request.form['metrics'],
        'ai': request.form['ai_response']
    }
    return '', 204  # No content, just acknowledge

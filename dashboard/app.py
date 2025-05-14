from flask import Flask, render_template, request

app = Flask(__name__)

# Temporary in-memory storage
logs = []

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        system_metrics = request.form['metrics']
        ai_response = request.form['ai_response']
        logs.append({'metrics': system_metrics, 'ai': ai_response})
    return render_template('index.html', logs=logs)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

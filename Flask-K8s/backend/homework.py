from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
CATEGORIES = ['colleague', 'family', 'etc']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/uploads/<category>/<path:filename>')
def uploaded_file(category, filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], category, filename)
    return send_file(file_path)

@app.route('/friend', methods=['GET', 'POST'])
def friend():
    if request.method == 'GET':
        return jsonify({
            "name": "Lee Tae Soo",
            "birth": "2001-04-13",
            "phone": "010-1234-5678",
            "email": "lee@example.com",
            "mbti": "CUTE"
        })
    else:
        data = request.get_json()
        return jsonify({"message": "등록 완료", "data": data})

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "파일이 없습니다"}), 400
    
    category = request.form.get('category', 'etc')
    file = request.files['file']
    
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({"error": "잘못된 파일"}), 400
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"{timestamp}_{file.filename}"
    
    category_path = os.path.join(app.config['UPLOAD_FOLDER'], category)
    os.makedirs(category_path, exist_ok=True)
    
    file.save(os.path.join(category_path, filename))
    
    return jsonify({
        "message": "업로드 성공",
        "filename": filename,
        "category": category
    })

@app.route('/gallery/<category>')
def gallery(category):
    if category not in CATEGORIES:
        return jsonify({"error": "잘못된 카테고리"}), 400
    
    category_path = os.path.join(app.config['UPLOAD_FOLDER'], category)
    if not os.path.exists(category_path):
        return jsonify({"images": []})
    
    images = [f for f in os.listdir(category_path) if allowed_file(f)]
    return jsonify({"images": sorted(images)})

@app.route('/health')
def health():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    for category in CATEGORIES:
        os.makedirs(os.path.join(UPLOAD_FOLDER, category), exist_ok=True)
    app.run(host='0.0.0.0', port=5000)

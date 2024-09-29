from flask import Flask, render_template, request, jsonify
import base64
from io import BytesIO
from PIL import Image
import os

app = Flask(__name__)

# 显示画布页面
@app.route('/')
def index():
    return render_template('index.html')

# 处理图像数据并触发后端 Python 任务
@app.route('/process_image', methods=['POST'])
def process_image():
    data_url = request.json.get('image_data')
    if data_url:
        # 将 Base64 图像数据解码并保存为文件
        image_data = base64.b64decode(data_url.split(',')[1])
        image = Image.open(BytesIO(image_data))
        image.save('drawing.png')  # 保存图像文件
        
        # 在这里触发你的 Python 任务
        result = run_python_task('drawing.png')

        return jsonify({"status": "success", "message": "任务已触发", "result": result})
    return jsonify({"status": "error", "message": "无图像数据"})

# 示例 Python 任务
def run_python_task(image_path):
    # 执行一些基于图像的任务
    # 例如：处理图像、运行深度学习模型等
    print(f"Processing image: {image_path}")
    return "任务完成"

if __name__ == '__main__':
    app.run(debug=True)

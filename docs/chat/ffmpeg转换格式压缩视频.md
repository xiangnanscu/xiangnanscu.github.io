# ffmpeg转换格式压缩视频

```py
import os
import subprocess
import shutil

# 定义目标分辨率
target_resolution = "720"  # 可以是 "480", "720", "1080" 等

# 获取当前文件夹路径
current_dir = os.getcwd()
output_dir = os.path.join(current_dir, "output")

# 如果output文件夹不存在，则创建它
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 递归查找所有mp4和mov文件
for root, dirs, files in os.walk(current_dir):
    if root == output_dir:
        continue
    for file in files:
        input_file = os.path.join(root, file)
        folder_name = os.path.basename(root)
        base_name, ext = os.path.splitext(file)
        ext = ext.lower()

        if ext == ".mov":
            # 转换 .mov 为 .mp4 并同时压缩
            output_file = os.path.join(output_dir, f"{folder_name}_{target_resolution}_{base_name}.mp4")
            if os.path.exists(output_file):
                print(f"Skipping {file} because it already exists in the output folder.")
                continue  # 跳过该文件

            # 构建ffmpeg命令
            ffmpeg_command = [
                "ffmpeg",
                "-loglevel", "warning",  # 控制日志级别，只显示警告和错误信息
                "-progress", "-",  # 将进度信息输出到标准输出
                "-i", input_file,
                "-vf", f"scale=-1:{target_resolution}",  # 保持宽高比，只调整高度
                "-c:v", "libx264",  # 使用H.264编码
                "-crf", "23",  # 质量因子，23是默认值，越小质量越高
                "-preset", "medium",  # 编码速度与文件大小平衡
                "-c:a", "aac",  # 使用AAC编码音频
                output_file
            ]

            # 打印命令以供调试
            print("Running command: ", " ".join(ffmpeg_command))

            try:
                # 执行ffmpeg命令
                subprocess.run(ffmpeg_command, check=True)
                print(f"Conversion and compression completed for {file}")
            except subprocess.CalledProcessError as e:
                print(f"Error occurred while converting and compressing {file}: {e}")

        if ext == ".mp4":
            output_file = os.path.join(output_dir, f"{folder_name}_{target_resolution}_{base_name}{ext}")
            if os.path.exists(output_file):
                print(f"Skipping {file} because it already exists in the output folder.")
                continue  # 跳过该文件

            # 构建ffmpeg命令
            ffmpeg_command = [
                "ffmpeg",
                "-loglevel", "warning",  # 控制日志级别，只显示警告和错误信息
                "-progress", "-",  # 将进度信息输出到标准输出
                "-i", input_file,
                "-vf", f"scale=-1:{target_resolution}",  # 保持宽高比，只调整高度
                "-c:v", "libx264",  # 使用H.264编码
                "-crf", "23",  # 质量因子，23是默认值，越小质量越高
                "-preset", "medium",  # 编码速度与文件大小平衡
                "-c:a", "copy",  # 直接复制音频流，不重新编码
                output_file
            ]

            # 打印命令以供调试
            print("Running command: ", " ".join(ffmpeg_command))

            try:
                # 执行ffmpeg命令
                subprocess.run(ffmpeg_command, check=True)
                print(f"Compression completed for {file}")
            except subprocess.CalledProcessError as e:
                print(f"Error occurred while compressing {file}: {e}")

print("Compression completed!")
```
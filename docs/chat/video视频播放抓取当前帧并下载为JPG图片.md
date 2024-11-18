# video视频播放抓取当前帧并下载为JPG图片
## prompt
使用esm + script setup + ts语法编写一个vue页面，用于在浏览器环境执行下列操作：给定一个cloudflare的r2 bucket的url, 例如https://xx.xx.com/foo.mp4，在域名xx.pages.dev下的页面使用video组件播放它，然后添加一个捕捉视频当前帧的按钮，点击后会获得该帧的jpg格式的binary数据
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  videoUrl: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const errorMessage = ref<string>('')

const captureFrame = async () => {
  const video = videoRef.value
  const canvas = canvasRef.value

  if (video && canvas) {
    try {
      // Attempt to draw current video frame
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const context = canvas.getContext('2d')
      if (context) {
        // Direct frame capture
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'video-frame.jpg'
            a.click()
            URL.revokeObjectURL(url)
          }
        }, 'image/jpeg')
      }
    } catch (error) {
      errorMessage.value = `Capture error: ${error instanceof Error ? error.message : String(error)}`
    }
  }
}

// Debug video loading
onMounted(async () => {
  try {
    const video = videoRef.value
    if (video) {
      video.onerror = (e) => {
        errorMessage.value = `Video load error: ${JSON.stringify(e)}`
      }
    }
  } catch (error) {
    errorMessage.value = `Mounted error: ${error instanceof Error ? error.message : String(error)}`
  }
})
</script>

<template>
  <div class="video-container">
    <video
      ref="videoRef"
      :src="videoUrl"
      crossorigin="anonymous"
      controls
      class="video-player"
    ></video>

    <button
      @click="captureFrame"
      class="capture-button"
    >
      Capture Frame
    </button>

    <canvas
      ref="canvasRef"
      style="display: none"
    ></canvas>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  margin-top: 10px;
  padding: 10px;
  background-color: #ffeeee;
  border: 1px solid red;
}
</style>
```
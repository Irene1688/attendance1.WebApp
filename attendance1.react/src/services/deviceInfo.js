import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const getVisitorInfo = async () => {
  try {
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load()
    
    // Get the visitor identifier when you need it.
    const fp = await fpPromise
    const result = await fp.get()

    function getCanvasFingerprint() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser Fingerprint', 10, 10);
      return btoa(canvas.toDataURL()); // Base64 编码
    }
    // return {
    //   //fingerprint: result.visitorId,
    //   userAgent: navigator.userAgent,
    //   platform: navigator.userAgentData?.platform,
    //   language: navigator.language,
    //   screenResolution: `${window.screen.width * devicePixelRatio}x${window.screen.height * devicePixelRatio}`,
    //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //   hardwareConcurrency: navigator.hardwareConcurrency,
    //   deviceMemory: navigator.deviceMemory,
    //   maxTouchPoints: navigator.maxTouchPoints,
    //   canvas: document.createElement('canvas').getContext('2d').canvas.toDataURL(),
    // }

    return {
      platform: navigator.userAgentData?.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width * window.devicePixelRatio}x${window.screen.height * window.devicePixelRatio}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hardwareConcurrency: navigator.hardwareConcurrency || 4, // 设定默认值
      deviceMemory: navigator.deviceMemory || 2, // 设定默认值
      maxTouchPoints: navigator.maxTouchPoints || (("ontouchstart" in window) ? 1 : 0),
      canvasHash: getCanvasFingerprint(), // 使用哈希值存储 Canvas 指纹
    };
    
  } catch (error) {
    console.error('Error getting device info:', error);
    // 返回基本设备信息作为备选
    return {
      //fingerprint: '',
      //userAgent: navigator.userAgent,
      platform: navigator.userAgentData?.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width * window.devicePixelRatio}x${window.screen.height * window.devicePixelRatio}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hardwareConcurrency: navigator.hardwareConcurrency || 4, // 设定默认值
      deviceMemory: navigator.deviceMemory || 2, // 设定默认值
      maxTouchPoints: navigator.maxTouchPoints || (("ontouchstart" in window) ? 1 : 0),
      canvasHash: getCanvasFingerprint(), // 使用哈希值存储 Canvas 指纹
    }
  }
} 

export const getDeviceType = async () => {
  if (navigator.userAgentData?.mobile) {
    return "Mobile";
  }

  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isMobile = /Android|iPhone|iPod|Windows Phone|Mobile|Silk/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)|PlayBook|Silk|Tablet/i.test(userAgent);
  const isWindows = /Windows NT/i.test(userAgent);
  const isMac = /Macintosh/i.test(userAgent);
  const isLinux = /Linux/i.test(userAgent);
  const isHarmonyOS = /Huawei|HarmonyOS/i.test(userAgent);

  if (isHarmonyOS) {
    return isTablet ? "Tablet" : "Mobile";
  }

  if (isTablet) return "Tablet";

  if (isMobile) return "Mobile";
  if (isWindows || isMac || isLinux) return "Desktop";
  
  return "Desktop";
}
  

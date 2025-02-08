import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const getVisitorInfo = async () => {
  try {
    // Initialize an agent at application startup.
    const fpPromise = FingerprintJS.load()
    
    // Get the visitor identifier when you need it.
    const fp = await fpPromise
    const result = await fp.get()
    return {
      fingerprint: result.visitorId,
      userAgent: navigator.userAgent,
      platform: navigator.userAgentData?.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  } catch (error) {
    console.error('Error getting device info:', error);
    // 返回基本设备信息作为备选
    return {
      fingerprint: '',
      userAgent: navigator.userAgent,
      platform: navigator.userAgentData?.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }
} 

export const getDeviceType = async () => {
    console.log(navigator)
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
  

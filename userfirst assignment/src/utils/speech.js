
export function speakText(text) {
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 1;
      window.speechSynthesis.speak(u);
    } catch (e) {
      console.error("TTS error", e);
    }
  }
  
  export function listenOnce({ lang = "en-US", timeout = 18 } = {}) {
    return new Promise((resolve, reject) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return reject(new Error("SpeechRecognition not supported"));
  
      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
  
      let finished = false;
      const stop = (result) => {
        if (finished) return;
        finished = true;
        try { rec.stop(); } catch {}
        resolve(result);
      };
  
      rec.onresult = (ev) => {
        const transcript = Array.from(ev.results).map(r => r[0].transcript).join(" ");
        stop(transcript);
      };
      rec.onerror = () => stop("");
      rec.onend = () => { if (!finished) stop(""); };
  
      try { rec.start(); } catch (err) { return reject(err); }
      setTimeout(() => stop(""), timeout * 1000);
    });
  }
  
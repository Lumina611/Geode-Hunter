// Original synthesized stone impact: no recordings, network or microphone.
export class StoneSound {
  enabled=true;
  context=null;
  async unlock(){
    if(!this.enabled)return 'muted';
    try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return 'unavailable';this.context??=new Audio();if(this.context.state==='suspended')await this.context.resume();return this.context.state==='running'?'ready':'blocked';}catch{return 'unavailable'}
  }
  async strike(number){
    const status=await this.unlock();if(!this.enabled)return 'muted';if(status!=='ready')return status;
    const ctx=this.context,now=ctx.currentTime,output=ctx.createGain();output.gain.value=.32;output.connect(ctx.destination);
    const duration=number===4?.42:.18,buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.exp(-i/(ctx.sampleRate*(number===4?.085:.028)));
    const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter();noise.buffer=buffer;filter.type='bandpass';filter.frequency.value=number===4?1150:1750-number*130;filter.Q.value=.75;noise.connect(filter).connect(output);noise.start(now);noise.stop(now+duration);
    const tone=ctx.createOscillator(),envelope=ctx.createGain();tone.type='sine';tone.frequency.setValueAtTime(210-number*18,now);tone.frequency.exponentialRampToValueAtTime(70,now+.13);envelope.gain.setValueAtTime(.7,now);envelope.gain.exponentialRampToValueAtTime(.001,now+.18);tone.connect(envelope).connect(output);tone.start(now);tone.stop(now+.2);
    // A brief higher resonance on reveal, without a magical music cue.
    if(number===4){const ring=ctx.createOscillator(),gain=ctx.createGain();ring.frequency.value=960;gain.gain.setValueAtTime(.035,now+.045);gain.gain.exponentialRampToValueAtTime(.001,now+.38);ring.connect(gain).connect(output);ring.start(now+.045);ring.stop(now+.4);}
    setTimeout(()=>output.disconnect(),600);return 'played';
  }
  setEnabled(on){this.enabled=on;if(!on)this.context?.suspend().catch(()=>{});}
}

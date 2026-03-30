(function(){
    const api_Url = "https://support-ai-epvm.vercel.app/api/chat";

    const scriptTag = document.currentScript;

    const ownerId = scriptTag.getAttribute("data-owner-id");
    if(!ownerId){
        console.error("Owner ID is required to initialize the chatbot");
        return;
    }

    // const bgColor = scriptTag.getAttribute("data-bg-color");

    const button = document.createElement("div");
    button.innerHTML="💬"
    Object.assign(button.style,{
        position:"fixed",
        bottom:"24px",
        right:"24px",
        width:"56px",
        height:"56px",
        borderRadius:"50%",
        // background: bgColor || "#000",
        background: "#000",
        // color for the background 
        color:"#fff",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        cursor:"pointer",
        fontSize:"22px",
        boxShadow:"0 15px 40px rgba(0,0,0,0.35)",
        zIndex:"999999",
    })

    document.body.appendChild(button);
    
    const box = document.createElement("div");
    Object.assign(box.style,{
        position:"fixed",
        bottom:"90px",
        right:"24px",
        width:"320px",
        height:"420px",
        background:"#fff",

        borderRadius:"14px",
        boxShadow:"0 25px 60px rgba(0,0,0,0.25)",
        display:"none",
        flexDirection:"column",
        overflow:"hidden",
       fontFamily:"Inter, sans-serif",
        zIndex:"999999",
    })
    box.innerHTML= `
   <div style="
  background:#000;
  color:#fff;
  padding:12px 14px;
  display:flex;
  justify-content:space-between;
">
  <span>Customer Support</span>
  <span id="chat-close" style="cursor:pointer;">×</span>
</div>

<!-- ✅ Messages FIRST -->
<div id="chat-messages" style="
  flex:1;
  padding:12px;
  overflow-y:auto;
  background:#f9fafb;
  display:flex;              /* ✅ REQUIRED */
  flex-direction:column;     /* ✅ REQUIRED */
"></div>

<!-- ✅ Input LAST (goes to bottom automatically) -->
<div style="
  display:flex;
  align-items:center;
  padding:10px;
  border-top:1px solid #e5e7eb;
  background:#fff;
">

  <div style="
    display:flex;
    align-items:center;
    flex:1;
    background:#f3f4f6;
    border-radius:999px;
    padding:6px 10px;
  ">

    <input 
      id="chat-input" 
      type="text" 
      placeholder="Message..."  
      style="
        flex:1;
        border:none;
        background:transparent;
        outline:none;
      "
    />

    <button id="chat-send" style="
      width:34px;
      height:34px;
      border-radius:50%;
      background:#000;
      color:#fff;
      border:none;
      cursor:pointer;
    ">
      ➤
    </button>

  </div>

</div>

    `
    document.body.appendChild(box);

    button.onclick =()=>{
        box.style.display = box.style.display === "none" ? "flex" : "none";

    }
    document.querySelector("#chat-close").onclick =()=>{
        box.style.display = "none";
    }

    const input = document.querySelector("#chat-input");
    const messageArea = document.querySelector("#chat-messages");
    const sendBtn = document.querySelector("#chat-send");

    function addMessage(text,from){
        const bubble = document.createElement("div");
        bubble.innerHTML=text
        Object.assign(bubble.style,{
            maxWidth:"78%",
            padding:"8px 12px",
            borderRadius:"14px",
            fontSize:"13px",
            lineHeight:"1.4",
            marginBottom:"8px",
            alignSelf: from === "user"? "flex-end":"flex-start",
            background: from === "user"?"#000":"#e5e7eb",
            color: from === "user"?"#fff":"#111",

            /* bubble direction polish */
            borderTopRightRadius: from ==="user"?"4px":"14px",
            borderTopLeftRadius: from ==="user"?"14px":"4px",
        })
        messageArea.appendChild(bubble)

        messageArea.scrollTop = messageArea.scrollHeight

    }

    sendBtn.onclick= async ()=>{
        const text = input.value.trim()
        if(!text){
            return
        }
        addMessage(text,"user")
        input.value=""
        
        const typing = document.createElement("div")
        typing.innerHTML="Typing..."
        Object.assign(typing.style,{
            fontSize:"12px",
            color:"#6b7280",
            marginBottom:"8px",
            alignSelf:"flex-start",
        })

        messageArea.appendChild(typing)
        messageArea.scrollTop = messageArea.scrollHeight

        try {
            const response = await fetch(api_Url,{
                method:"POST",
                headers:{"content-Type":"application/json"},
                body:JSON.stringify({
                    ownerId,message:text
                })
            })
            const data = await response.json()
            messageArea.removeChild(typing)
            addMessage(data.reply || "Something went wrong","ai")

        } catch (error) {
            console.log(`error: ${error} from chatbot.js`);
            
            messageArea.removeChild(typing)
            addMessage( "Something went wrong","ai")
        }
    }

})()
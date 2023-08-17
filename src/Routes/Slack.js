import { useEffect, useRef, useState } from "react"
import { io } from "socket.io-client";
import Menu from "../Components/Menu";
import { getChannelsListApi, getChatApi, getRepliesApi } from "../apiCalls/apiCalls";
import { BiArrowBack } from "react-icons/bi"
import "../CSS/Slack.css"


let socket

export default function Slack({ notify, updateNotification }){

    const [ channelsList, setChannelsList ] = useState([])
    const [ chats, setChats ] = useState({})
    const [ heading, setHeading ] = useState("Channels")
    const [ currentChannel, setCurrentChannel ] = useState("")
    const [ showThread, setShowThread ] = useState(false)
    const [ threadIndex, setThreadIndex ] = useState(-1)
    const [ textMessage, setTextMessage ] = useState("")
    const [ userId, setUserId ] = useState("")
    const [ userName, setUserName ] = useState("")
    const [ replies, setReplies ] = useState([])
    const scrollableRef = useRef(null);
    

    // async function sendSignal(){
    //     const res = await fetch("http://localhost:4005/test")
    // }
    
    function compareChannels(a, b) {
        if (a.read && !b.read) {
          return -1; // a comes before b
        }
        if (!a.read && b.read) {
          return 1; // b comes before a
        }
      
        // If both have the same read status or both are unread
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
      
        if (nameA < nameB) {
          return -1; // a comes before b
        }
        if (nameA > nameB) {
            return 1; // b comes before a
          }
          return 0; // names are equal
        }

    async function getChannelsList(){
        const response = await getChannelsListApi()
        if(response.status === 200){
            setChannelsList(response.channelsList.sort(compareChannels))
            setUserId(response.userId)
            setUserName(response.userName)
        }
        
    }

    async function getChat(id){
        const response = await getChatApi(id)
        return response.status === 200 ? response.chat.reverse() : []
    }


    async function openChat(chatName, id){
        setHeading(chatName)
        const chat = await getChat(id)
        setChats((prev) => {
            const newChats = {...prev}
            newChats[chatName] = chat
            return newChats
        })
        setChannelsList((prev) => {
            const newChats = [...prev]
            for(let i = 0; i < newChats.length; i++){
                if(id === newChats[i].id){
                    newChats[i].read = false
                    break
                }
            }
            return newChats
        })
        setChannelsList(channelsList => channelsList.sort(compareChannels))
        setCurrentChannel(id)
    }

    async function getReplies(ts, index){
        const res = await getRepliesApi(currentChannel, ts)
        res.status === 200 && setChats((prev => {
            const newChat = {...prev}
            newChat[heading][index]["replies"] = res.chat
            return newChat
        }))
        setThreadIndex(index)
        setShowThread(true)
    }

    function goBack(){
        if(showThread){
            setShowThread(false)
        }
        else{
            setHeading("Channels")
        }
    }

    async function sendMessage(e){
        e.preventDefault()
        const response = await fetch('http://worldtimeapi.org/api/ip');
        const data = await response.json();
    
        const datetime = response.ok ? new Date(data.datetime) : new Date()
        const unixTimestamp = datetime.getTime() / 1000;
        const formattedTimestamp = unixTimestamp.toFixed(6);

        
        if(showThread){
            socket.emit("postMessage", currentChannel, userId, textMessage, showThread, chats[heading][threadIndex].ts)
            setChats((prev) => {
                const newChats = {...prev}
                newChats[heading][threadIndex]["replies"].push({
                    user: userId,
                    username: userName,
                    text: textMessage,
                    ts: String(formattedTimestamp),
                    inserted: true
                })
                return newChats
            })
        }
        else{
            socket.emit("postMessage", currentChannel, userId, textMessage, showThread, "")
            setChats((prev) => {
                const newChats = {...prev}
                newChats[heading].push({
                    user: userId,
                    username: userName,
                    text: textMessage,
                    replyCount: 0,
                    ts: String(formattedTimestamp),
                    inserted: true
                })
                return newChats
            })
        }
        setTextMessage("")
    }

    // useEffect(() => {
    //     if(!showThread || heading !== "Channels"){
    //         scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    //     }
    //     else{
    //         scrollableRef.current.scrollTop = 0
    //     }
    // }, [chats])

    useEffect(() => {
        if(socket){
            socket.on("sendMessage", (eventData) => {
                let channelName = ""

                
              
                for(let i = 0; i < channelsList.length; i++){
                    
                    if(channelsList[i].id === eventData.channel){
                        channelName = channelsList[i].name
                        if(channelsList[i].private){
                            channelName = '🔒 ' + channelName
                        }
                        else{
                            channelName = '\u00A0# ' + channelName
                        }
                        break
                    }
                }
                if(channelName === ""){
                    return
                } 
                setChats((prev) => {
                    const newChats = {...prev}
                    if(!newChats[channelName]){
                        return newChats
                    }

                    if(eventData.thread_ts && showThread){
                        let index = -1
                        for(let i = 0; i < newChats[channelName].length; i++){
                            if(newChats[channelName][i].ts === eventData.thread_ts){
                                index = i
                                break
                            }
                        }
                        if(index === -1){
                            return newChats
                        }

                        if(newChats[channelName][index] && newChats[channelName][index]["replies"] && newChats[channelName][index]["replies"].length){

                        for(let i = newChats[channelName][index]["replies"].length - 1; i >= 0 && newChats[channelName][index]["replies"].length - 10; i--){
                            if(newChats[channelName][index]["replies"][i].ts === eventData.ts && newChats[channelName][index]["replies"][i].text === eventData.text){
                                return newChats
                            }
                            if(newChats[channelName][index]["replies"][i].inserted && newChats[channelName][index]["replies"][i].text === eventData.text){
                                newChats[channelName][index]["replies"][i].inserted = false
                                newChats[channelName][index]["replies"][i].ts = eventData.ts
                                return newChats
                            }
                        }
                        }
                        if(newChats[channelName] && newChats[channelName][index]){
                            newChats[channelName][index]["replies"].push({
                                replyCount: 0,
                                username: eventData.userName,
                                text: eventData.text,
                                ts: eventData.ts,
                            })
                        }
                        
                    }
                    else if(!eventData.thread_ts){
                        for(let i = newChats[channelName].length - 1; i >= 0 && newChats[channelName].length - 10; i--){
                            if(newChats[channelName][i].ts === eventData.ts && newChats[channelName][i].text === eventData.text){
                                return newChats
                            }
                            if(newChats[channelName][i].inserted && newChats[channelName][i].text === eventData.text){
                                newChats[channelName][i].inserted = false
                                newChats[channelName][i].ts = eventData.ts
                                return newChats
                            }
                        }
    
                        
    
                        
                        
                        newChats[channelName].push({
                            replyCount: 0,
                            username: eventData.userName,
                            text: eventData.text,
                            ts: eventData.ts,
                        })
                    }

                    if(eventData.thread_ts){
                        for(let i = 0; i < replies.length; i++){
                            if(replies[i].channel === eventData.channel && replies[i].thread_ts === eventData.thread_ts && replies[i].ts === eventData.ts){
                                return newChats
                            }
                        }
                        setReplies((prev) => {
                            const newReplies = [...prev]
                            newReplies.push({
                                channel: eventData.channel,
                                thread_ts: eventData.thread_ts,
                                ts: eventData.ts
                            })
                            return newReplies
                        })
                        let index = -1
                        for(let i = 0; i < newChats[channelName].length; i++){
                            if(newChats[channelName][i].ts === eventData.thread_ts){
                                index = i
                                break
                            }
                        }
                        if(index === -1){
                            return newChats
                        }
                        newChats[channelName][index].replyCount += 1
                    }

                    
                    return newChats
                })
            })
        }
        

        return () => {
            socket.off("sendMessage")
        }
    }, [channelsList, chats])

    useEffect(() => {

        getChannelsList()

        socket = io('https://app.tutorly.com/'); 
        //socket.emit("joinChat", "chat");

        socket.on("request", () => {
            console.log("received");
        })

        

        return () => {
            socket.off("request")
        }
        
       
    }, [])

    

    return <div className="slack">
        <Menu notify = {notify} updateNotification = {updateNotification} />
        <div className="channels-container">
            <h1>Slack</h1>
            <h2>
                {heading !== "Channels" && <div onClick={goBack} className="back-arrow"><BiArrowBack size={20} /></div>}
                {heading}
            </h2>
            
            <div ref={scrollableRef} className="channels">
                {
                    heading === "Channels" ?
                    channelsList.map((channel, index) => {
                        return <p key={index} className={channel.read ? "channel-name channel-name-read" : "channel-name"} onClick={() => {openChat(`${channel.private ? '🔒': '\u00A0#'} ${channel.name}`, channel.id)}} >{channel.private ? '🔒': '\u00A0\u00A0#\u00A0\u00A0'}   {channel.name} {channel.read && <div className="unread-dot"></div>}</p>
                    })
                    :
                    (
                        showThread ?
                        chats[heading] && chats[heading][threadIndex] && chats[heading][threadIndex]["replies"] ?
                        chats[heading][threadIndex]["replies"].map((message, index) => {
                            return <div key={index} className="message-div">
                            <p className="message-user-ts"><span className="message-user">{message.username}</span> <span className="message-ts">{(new Date(message.ts * 1000)).toLocaleDateString()} {(new Date(message.ts * 1000)).toLocaleTimeString()}</span></p>
                            <p className="message-text">{message.text}</p>
                            </div>
                        })
                        :
                        <p>{chats[heading][threadIndex]}</p>

                        :
                        chats[heading] ?
                        chats[heading].map((message, index) => {
                            return <div key={index} className="message-div">
                                <p className="message-user-ts"><span className="message-user">{message.username}</span> <span className="message-ts">{(new Date(message.ts * 1000)).toLocaleDateString()} {(new Date(message.ts * 1000)).toLocaleTimeString()}</span></p>
                                <p className="message-text">{message.text}</p>
                                <div className="replies-div">
                                <span className="reply-button" onClick={() => {getReplies(message.ts, index)}}>Reply</span>
                                
                                {message.replyCount > 0 && <span className="reply-button" onClick={() => {getReplies(message.ts, index)}}>{message.replyCount} {message.replyCount === 1 ? 'Reply' : 'Replies'}</span>}
                                </div>
                            </div>
                        })
                        :
                        <p>No Messages</p>
                    )
                }
            </div>
            {heading !== "Channels" && <form className="message-form" onSubmit={sendMessage}>
                <input value={textMessage} onChange={(e) => setTextMessage(e.target.value)} className="message-input" type="text" placeholder={showThread ? "Reply..." : "Type a message..."} required />
                <input className="message-send" type="submit" value = "Send" />
            </form>}
        </div>
    </div>
}
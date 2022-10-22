import Header from '../components/Header';
import Body from '../components/Body';
import Form from '../components/Form';
import {useEffect,useState} from 'react';
import {AiOutlineRollback,AiFillSound} from 'react-icons/ai';
import {BsChevronDown,BsMusicNoteBeamed} from 'react-icons/bs'
import {useRouter} from 'next/router';
import Link from 'next/link';
import {useRecoilState} from 'recoil';
import {roomUserState,musicState,soundState} from '../atoms/userAtom';

export default function index() {
	const [currentRoom,setCurrentRoom] = useRecoilState(roomUserState);
	const router = useRouter();
  const [music,setMusic] = useRecoilState(musicState);
  const [sound,setSound] = useRecoilState(soundState);
  const [songPlaying,setSongPlaying] = useState('4');
  const [reveal,setReveal] = useState(true);
  // const [song1,setSong1] = useState(null);
  // const [song2] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_w2vUtH8u5?ik-sdk-version=javascript-1.4.3&updatedAt=1666427645567"));
  // const [song3] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_eNbkbyoed?ik-sdk-version=javascript-1.4.3&updatedAt=1666427691677"));
  // const [song4,setSong4] = useState(null);
  const song1 = document.getElementById('song1')
  const song4 = document.getElementById('song4')

	useEffect(()=>{
    // setSong1(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_jpmwcDOYU?ik-sdk-version=javascript-1.4.3&updatedAt=1666427604864"));
    // setSong4(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_GmizVDbYB?ik-sdk-version=javascript-1.4.3&updatedAt=1666427720726"))
		if(localStorage.getItem('snakes')){
      if(typeof Audio !=="undefined"){
        song4.pause();
        song1.pause();        
      }
			router.push('/play');
		}
    song4.addEventListener('ended',()=>{
      setSongPlaying('1');
      if(typeof Audio !=="undefined"){
        song1.play();
      }
    })
    song1.addEventListener('ended',()=>{
      setSongPlaying('4');
      if(typeof Audio !=="undefined"){
        song4.play();
      }
    })
	},[])

  useEffect(()=>{
    if(music && !localStorage.getItem('snakes')){
      if(songPlaying==='4'){
          if(typeof Audio !=="undefined"){
            song4.play();
          }
      }else{
        if(typeof Audio !=="undefined"){
          song1.play();
        }
      }
    }else{
      if(typeof Audio !=="undefined"){
        song4.pause();
        song1.pause();
      }
    }
  },[music])

  return(
    <div className="relative bg-[url('https://images.unsplash.com/photo-1595744043037-68de3376ed59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80')] 
    bg-cover md:bg-[#060126] md:bg-[url('https://images.unsplash.com/photo-1635028538158-0105e78c2fcf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')] 
    md:bg-center flex justify-center  md:bg-cover bg-center min-h-screen" >
     <audio src="https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_jpmwcDOYU?ik-sdk-version=javascript-1.4.3&updatedAt=1666427604864"
     id="song1"></audio>
     <audio src="https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_GmizVDbYB?ik-sdk-version=javascript-1.4.3&updatedAt=1666427720726"
     id="song4"></audio>
     <BsChevronDown 
      onClick={()=>{setReveal(!reveal)}}
      className={`h-9 w-9 rounded-full border-2 shadow-xl shadow-sky-500 bg-black/50
      border-red-500 fixed top-[88px] ${reveal ? "-rotate-[540deg] transition duration-1400 ease-in-out" : ""} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 hover:shadow-orange-500 transition-all duration-400 z-20 ease-in-out`} />
      <BsMusicNoteBeamed 
      onClick={()=>{setMusic(!music)}}
      className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl ${music ? "shadow-sky-500" : "-rotate-[540deg] shadow-orange-500" } bg-black/50
      border-red-500 fixed  ${reveal ? "top-[135px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />
      <AiFillSound 
      onClick={()=>{setSound(!sound)}}
      className={`h-9 w-9 rounded-2xl border-2 z-10 shadow-xl ${sound ? "shadow-sky-500" : "-rotate-[540deg] shadow-orange-500" } bg-black/50
      border-red-500 fixed  ${reveal ? "top-[182px] opacity-100" : "top-[88px] opacity-0"} p-2 z-20 text-sky-500 left-3 cursor-pointer hover:scale-110 transition-all duration-400 ease-in-out`} />
     
      <Header/>
      <div className="max-w-6xl flex items-center flex-col" >
      	<Body/>
      	<Form song1={song1} song4={song4} />
      </div>
    </div>


    )
}
import Header from '../components/Header';
import SnakeBoard from '../components/SnakeBoard';
import {socket} from '../service/socket';
import {currentUserState,currentUsersState,snakeBiteState,roomUserState,availableState,ladderBiteState,musicState,soundState} from '../atoms/userAtom';
import {useEffect,useState} from 'react';
import {useRecoilState} from 'recoil';
const route = process.env.NEXT_PUBLIC_SERVER_BASE;
import {useRouter} from 'next/router';
import axios from 'axios';
import {GiRattlesnake} from 'react-icons/gi'
import {FaChessQueen,FaChess} from 'react-icons/fa';


export default function play() {
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentUsers,setCurrentUsers] = useRecoilState(currentUsersState);
	const [snakeBite,setSnakeBite] = useRecoilState(snakeBiteState);
	const [ladderBite,setLadderBite] = useRecoilState(ladderBiteState);
	const [currentRoom,setCurrentRoom] = useRecoilState(roomUserState);
	const [available,setAvailable] = useRecoilState(availableState);
	const [players,setPlayers] = useState([]);
	const [music,setMusic] = useRecoilState(musicState);
  	const [sound,setSound] = useRecoilState(soundState);
  	const [songPlaying,setSongPlaying] = useState('4');
	const router = useRouter();
 	const [song1] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_jpmwcDOYU?ik-sdk-version=javascript-1.4.3&updatedAt=1666427604864"));
 	const [song4] = useState(typeof Audio !=="undefined" &&  new Audio("https://ik.imagekit.io/d3kzbpbila/Audios/thejashari_GmizVDbYB?ik-sdk-version=javascript-1.4.3&updatedAt=1666427720726"));

	
	useEffect(()=>{
		async function fetch() {
		if(localStorage.getItem('snakes')){
			let user = localStorage.getItem('snakes')
			user = JSON.parse(user)
			const room = user.room;
			const {data} = await axios.post(`${route}/api/auth/checkRoom`,{
				name:room,
			})
			if(data.status === true){
				setCurrentUser(data.docs[0]);
				setCurrentRoom(data.docs[0].name);
				const user1 = {
					name:user.name,
					room:user.room,
					data:data
				}
				socket.emit('joinroom',user1);
			}else{
				song1.pause();
				song4.pause();
				router.push('/')
			}
		}else{
			song1.pause();
			song4.pause();
			router.push('/')
		}
	}
	fetch();
	song4.addEventListener('ended',()=>{
		setSongPlaying('1');
      	song1.play();
    })
    song1.addEventListener('ended',()=>{
    	setSongPlaying('4');
      	song4.play();
    })	
},[])

	useEffect(()=>{
	    if(music && localStorage.getItem('snakes')){
	    	if(songPlaying==='4'){
	      		song4.play();
	    	}else{
	    		song1.play();
	    	}
	    }else{
	      song4.pause();
	      song1.pause();
	    }
	},[music])


	return(
		<div className="relative overflow-hidden bg-[url('https://images.unsplash.com/photo-1595744043037-68de3376ed59?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80')] 
	    bg-cover md:bg-[#060126] md:bg-[url('https://images.unsplash.com/photo-1635028538158-0105e78c2fcf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80')] 
	    md:bg-center flex items-center flex-col md:bg-cover bg-center min-h-screen" >
	     
	      <Header/>
	      //body
	      <div className="w-[100vw] flex items-center flex-col" >
	      	<div className="w-[100%] flex justify-center" >
				<img 
				className="
			 	hover:scale-110 transition duration-500 ease-in-out cursor-pointer w-9/12 -rotate-1 md:w-5/12 mt-24 md:mt-27"
				src=
				"https://ik.imagekit.io/d3kzbpbila/thejashari_acUAOx_of?ik-sdk-version=javascript-1.4.3&updatedAt=1665237423310"
				alt=""/>
			</div>
	     	<SnakeBoard song1={song1} song4={song4} />
	      </div>
	      <div className="flex flex-col members text-white max-w-6xl m-5 flex items-center text-center justify-center">
	      	<h2 className="font-semibold m-5 text-2xl text-gray-300" >Active Players</h2>
	      	<div className="grid grid-cols-3 gap-[50px]">
	      		<div className="flex items-center justify-center" >
	      			<h2 className="text-xl font-semibold" >Coin</h2>
	      		</div>
	      		<div className="flex items-center justify-center" >
	      			<h2 className="text-xl font-semibold" >Name</h2>
	      		</div>
	      		<div className="flex items-center justify-center" >
	      			<h2 className="text-xl font-semibold" >Position</h2>
	      		</div>
	      	</div>
	      	<div className="mt-5 z-20">
	      		{currentUsers?.map((user)=>(
	      		<div className="grid bg-black/70 rounded-lg cursor-pointer hover:bg-gray-800/70 z-20 mt-2 transition duration-400 ease-in-out grid-cols-3 gap-10" >
	      			<div className="flex mt-4 mb-4 items-center justify-center" >
	      				<FaChessQueen className={`h-7 w-7 ${user.hasChance? "shadow-red-500/80" : "shadow-sky-500/80" } shadow-xl hover:shadow-sky-500 transition duration-400 ease-out`} style={{color:`${user.color}`}} />
	      			</div>
	      			<div className="flex mt-4 mb-4 items-center justify-center" >
	      				<h1 className="text-md md:text-lg text-gray-200 font-semibold" >{user.name}</h1>
	      			</div>
	      			<div className="flex mt-4 mb-4 items-center justify-center" >
	      				<h2 className="text-xl font-semibold">{user.position}</h2>
	      			</div>
	      		</div>
	      		))}
	      	</div>
	    </div>

	    <img 
	    className={`fixed w-70 ${snakeBite ? "opacity-80 transition duration-400 ease-in-out" : "opacity-0 transition duration-400 ease-in-out"} transition duration-500 ease-in-out rounded-lg h-55 bottom-7 right-7 shadow-lg shadow-red-500`} 
	    src="https://ik.imagekit.io/d3kzbpbila/snake-hisss_LkDDqUmxG.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1666362032255"
		alt=""/>
		<img 
	    className={`fixed w-70 ${ladderBite ? "opacity-80 transition duration-400 ease-in-out" : "opacity-0 transition duration-400 ease-in-out"} transition duration-500 ease-in-out rounded-lg h-55 bottom-7 right-7 shadow-lg shadow-red-500`} 
	    src="https://ik.imagekit.io/d3kzbpbila/woody-woodpecker-ladder_qgbDsVEFO.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1666364404474"
		alt=""/>

	    </div>


		)
}

// {currentUser?.users?.map((user)=>(
// 	      			<div className="m-2 flex flex-col flex-wrap md:flex-row items-center justify-center" >
// 	      				<GiRattlesnake className={`h-7 w-7 shadow-orange-500/20 shadow-md hover:shadow-sky-500 transition duration-400 ease-out`} style={{color:`${user.color}`}} />
// 	      				<h1 className="ml-1 text-md md:text-lg text-gray-200 font-semibold" >{user.hasChance ? "*": ""} {user.name} ({user.position})</h1>
// 	      			</div>
// 	      		))}
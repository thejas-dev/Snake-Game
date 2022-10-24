import {motion} from 'framer-motion' ;
import {currentUserState,currentColorState,roomUserState,positionState,musicState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil';
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react';
import {useRouter} from 'next/router';
import axios from 'axios';
import {socket} from '../service/socket';
const route = process.env.NEXT_PUBLIC_SERVER_BASE;

export default function Form({stopAudio1,stopAudio2}) {

	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [currentRoom,setCurrentRoom] = useRecoilState(roomUserState);
	const [music,setMusic] = useRecoilState(musicState);
	const [currentColor,setCurrentColor] = useRecoilState(currentColorState)
	const [position,setPosition] = useRecoilState(positionState);
	const [name,setName] = useState('');
	const [submitted,setSubmitted] = useState(false)
	const [room,setRoom] = useState('');
	const [color,setColor] = useState('#f745e6');
	const router = useRouter();

	const toastOption={
		position: "top-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "light",
	}

	const checkSubmit = (e) =>{
		e.preventDefault();
		if(room.length>3){
			if(name.length>3){
				handleSubmit();
				setSubmitted(true)
			}else{
				console.log("Name Must Have More than 3 Characters")
			}
		}else{
			console.log("Room Name must have more than 3 Characters")
		}
	}


	const handleSubmit = async() =>{
		setCurrentRoom(room);
		setCurrentColor(color);
		const user = {
			name:name,
			room:room,
			color:color,
		}
		const {data} = await axios.post(`${route}/api/auth/checkRoom`,{
			name:room,
		})
		const RoomId = data?.docs[0]?._id;
		const users = data?.docs[0]?.users;
		const allUsers = users?.map((user)=>{
			return (user.name)
		})
		if(allUsers && allUsers.includes(name)){
			toast("Player With Same Name Already Exists in this Room",toastOption)
		}else{
			if(data.status===false){
				const{data} = await axios.post(`${route}/api/auth/createRoom`,{
					name:room,
					users:[
						{
							name:name,
							position:position,
							color:color,
							hasChance:true,						
						},
					]
				})
				setCurrentUser(data)
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/play')
				// if(typeof Audio !=="undefined"){
				// 	song1.pause();
				// 	song4.pause();
				// }
				// socket.emit('joinroom',user)
			}
			if(data.status === true){
				if(data?.docs[0].users.length<1){
				const newUser ={
							name:name,
							position:position,
							color:color,
							hasChance:true,
						}
				users.unshift(newUser)
				const{data} = await axios.post(`${route}/api/auth/joinRoom/${RoomId}`,{
					users
				})
				setCurrentUser(data)
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/play')
				// if(typeof Audio !=="undefined"){
				// 	song1.pause();
				// 	song4.pause();
				// }
				}else{
				const newUser ={
							name:name,
							position:position,
							color:color,
							hasChance:false,
						}					
				users.unshift(newUser)
				const{data} = await axios.post(`${route}/api/auth/joinRoom/${RoomId}`,{
					users
				})
				setCurrentUser(data)
				stopAudio1();
				stopAudio2();
				setMusic(false);
				router.push('/play');
				// if(typeof Audio !=="undefined"){
				// song1.pause();
				// song4.pause();
				// }
				}
				// socket.emit('joinroom',user)
			}
			localStorage.setItem('snakes',JSON.stringify(user));
			setName('');
			setRoom('');			
		}
	}


	return(



		<div className="relative w-full flex" >
			<img className="absolute z-0 w-4/12 md:w-2/12 top-[90px] opacity-20 " 
			src="https://ik.imagekit.io/d3kzbpbila/snakeform_LbOEGN1WH.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1665238880828"
			
			alt=""
			/>
			<ToastContainer/>
			<form 
			onSubmit={(e)=>{checkSubmit(e)}}
			className="z-1 w-full overflow-hidden mt-10 flex items-center gap-5 flex-col justify-center" >	
				<motion.div 
				initial={{
					opacity:0,
					y:280
				}}
				transition={{duration:2.5,
					type: "spring", stiffness: 400, damping: 10}}
				whileInView={{opacity:1,y:0}}
				whileHover={{
				    scale: 1.1
				  }}
				  whileTap={{ scale: 0.8 }}
				className="mt-10 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="text" id="room name"
					placeholder="Enter Room Name"
					className="text-center p-5 outline-none bg-transparent"
					onChange={(e)=>setRoom(e.target.value)}
					value={room}
					/>
				</motion.div>
				<motion.div 
				initial={{
					opacity:0,
					y:-200
				}}
				transition={{duration:2.5,
				type: "spring", stiffness: 400, damping: 10 }}
				whileInView={{opacity:1,y:0}}
				whileHover={{
				    scale: 1.1
				  }}
				  whileTap={{ scale: 0.8 }}
				className="mt-10 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="text" id="room name"
					placeholder="Enter Your Name"
					className="text-center p-5 outline-none bg-transparent"
					onChange={(e)=>setName(e.target.value)}
					value={name}
					/>
				</motion.div>
				<motion.div 
				initial={{
					opacity:0,
					y:-200
				}}
				transition={{duration:2.5,
				type: "spring", stiffness: 400, damping: 10 }}
				whileInView={{opacity:1,y:0}}
				whileHover={{
				    scale: 1.1
				  }}
				  whileTap={{ scale: 0.8 }}
				className="mt-5 rounded-full bg-black/70 text-white 
				border-2 border-red-500 shadow-xl shadow-orange-500/40
				focus-within:border-sky-500 focus-within:shadow-sky-500/40 transition-shadow
				font-semibold duration-400 ease-in-out" >
					<input type="color" id="color"
					className="text-center p-[0.3rem] b-0 cursor-pointer rounded-full outline-none bg-transparent"
					onChange={(e)=>setColor(e.target.value)}
					value={color}
					/>
				</motion.div>
				{
					submitted?  "" : 
						<motion.button 
						initial={{
							scale:0.3,
							opacity:0
						}}
						transition={{duration:4,
						 type: "spring", stiffness: 400, damping: 10 }}
						whileInView={{opacity:1,scale:1}}
						whileHover={{
						    scale: 1.1
						  }}
						  whileTap={{ scale: 0.8 }}
						type="submit" 
						className="mt-10 rounded-full text-white bg-sky-500/70 pr-5 pl-5 pt-2 pb-2 text-xl border-2 border-orange-500 
						shadow-orange-500/40 mb-10 font-semibold shadow-xl">
							Join
						</motion.button>
				}
				

			</form>
		</div>

		)
}
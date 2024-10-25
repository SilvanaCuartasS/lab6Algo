import  {firebaseConfig} from './firebaseConfig'
import 'firebase/storage';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
 let db: any;
 
 const getFirestoreInstance = async () =>  {
	if (!db) {
		const  {getFirestore} = await import('firebase/firestore')
		const  {initializeApp} = await import('firebase/app')
	
		const app = initializeApp(firebaseConfig);
		db = getFirestore(app);
		
	}
	return db;
};


export const addSong = async (song: any) =>  {
	try {
		const db = await getFirestoreInstance();
		const  { collection, addDoc} = await import('firebase/firestore');
		const songWithTimestamp = {
            ...song,
            dateadded: new Date().toISOString()
        };
		
		const where = collection(db, 'songs');
		await addDoc(where, songWithTimestamp);
		console.log('Se añadió con éxito');
		
	} catch (error) {
	console.error('Error adding document', error);		
	}
}

export const getSongs = async () =>  {
	try {
		const db = await getFirestoreInstance();
		const  { collection, getDocs} = await import('firebase/firestore');
		const where = collection(db, 'songs');
		const querySnapshot = await getDocs(where);
		const data: any[] =[];

		querySnapshot.forEach((doc) => {
			data.push(doc.data());
		});
		return data;
	} catch (error) {
	console.error('Error getting documents', error)
	}
}; 

export const uploadImage = async (image: any, project: any) => {
	console.log(project, image)
	if (image === undefined) {
	  throw new Error('Image is undefined')
	}
  
	try {
	  const storage = getStorage()
	  const storageRef = ref(storage, `${project}/${image.name} `)
	  await uploadBytes(storageRef, image)
	  const imageURL = await getDownloadURL(storageRef)
	  return imageURL
	} catch (e) {
	  console.error('Error uploading image: ', e)
	  throw e
	}
}
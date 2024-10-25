import * as components from '../components/indexPadre'
import { addSong, getSongs } from '../utils/firebase';
import '../components/Song/song'
import styles from './styles.css'
import Song, { Attribute } from '../components/Song/song';
import firebase from 'firebase/app';
import { uploadImage } from '../utils/firebase';

const song =  {
    title: '',
    autor: '',
    album: '',
    duracion: '',
    image: '',
    dateadded: ''
}

class Dashboard extends HTMLElement {

    songsList: Song[]=[]
        constructor()  {
            super();
            this.attachShadow( {mode: 'open'});
        }
    
        connectedCallback() {
            this.render();
        }

        changeTitle(e: any)  {
            song.title = e.target.value;
        }
        changeAutor(e: any)  {
            song.autor = e.target.value;
        }
        changeAlbum(e: any)  {
            song.album = e.target.value;
        }

        changeDuracion(e: any)  {
            song.duracion = e.target.value;
        }
        changeImage(e: any) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                song.image = reader.result as string;
            };
            if (file) {
                reader.readAsDataURL(file);
            };
        }
        
        
        submitForm()  {

            addSong(song);
           
        }

        
        async render()  {
            if (this.shadowRoot) {
                this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="../src/screens/styles.css">
                <h1>MY PLAYLIST</h1>
                <div class="createSong">
                    <input id="title" type="text" placeholder="Titulo">
                    <input id="autor" type="text" placeholder="Autor">
                    <input id="album" type="text" placeholder="Album">
                    <input id="duracion" type="text" placeholder="Duración">
                    <form id="imageForm">
                        <label for="photo" id="customLabel">Img</label>
                        <input type="file" id="photo" accept="image/*">
                    </form>
                    <button id="submitButton">Guardar</button>
                 
                </div>
                <section>
                    <div id="items">
                        <p id="titulo">Título</p>
                        <p>Álbum</p>
                        <p id="fecha">Fecha en que se publicó</p>
                        <div id="svg">
                            <p>Duración</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#ccccccd8" d="M12 20c4.42 0 8-3.58 8-8s-3.58-8-8-8s-8 3.58-8 8s3.58 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10C6.47 22 2 17.5 2 12S6.5 2 12 2m.5 11H11V7h1.5v4.26l3.7-2.13l.75 1.3z"/>
                            </svg>
                        </div>
                    </div>
                    <hr>
                    <div class="songs"></div>
                </section>
                `;

                const cssDashboard = this.ownerDocument.createElement("style");
                cssDashboard.innerHTML = styles;
                this.shadowRoot?.appendChild(cssDashboard);
               
                //Eventos a cada input y boton, llamo la función que cambia el estado
                const buttonSubmit = this.shadowRoot?.querySelector("#submitButton")as HTMLButtonElement;
                buttonSubmit.addEventListener('click', this.submitForm);

                const songTitle = this.shadowRoot?.querySelector("#title") as HTMLInputElement;
                songTitle.addEventListener('change', this.changeTitle);
	
                const songArtist = this.shadowRoot?.querySelector("#autor") as HTMLInputElement;
                songArtist.addEventListener('change', this.changeAutor);

                const songAlbum = this.shadowRoot?.querySelector("#album") as HTMLInputElement;
                songAlbum.addEventListener('change', this.changeAlbum);

                const songDuration = this.shadowRoot?.querySelector("#duracion") as HTMLInputElement;
                songDuration.addEventListener('change', this.changeDuracion);

                const songImage = this.shadowRoot?.querySelector("#photo") as HTMLInputElement;
                songImage.addEventListener('change', this.changeImage.bind(this));


                //Traigo la data y renderizo las songs
                const songs = await getSongs();
                songs?.forEach(song => {
                    const songItem = this.ownerDocument.createElement('song-commponent') as Song;
                    songItem.setAttribute(Attribute.titlesong, song.title);
                    songItem.setAttribute(Attribute.autor, song.autor);
                    songItem.setAttribute(Attribute.album, song.album);
                    songItem.setAttribute(Attribute.image, song.image);
                    songItem.setAttribute(Attribute.duration, String(song.duracion));
                    songItem.setAttribute(Attribute.dateadded, song.dateadded);
                    this.songsList.push(songItem);
                });

                const container = this.shadowRoot?.querySelector('.songs');
                this.songsList.forEach((song) => {
                    container?.appendChild(song);
                });
            };
            
        }
    
    }

customElements.define('app-dashboard', Dashboard);
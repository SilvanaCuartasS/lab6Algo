import styles from './song.css';

export enum Attribute {
    "idsong" = "idsong",
    "image" = "image",
    "titlesong" = "titlesong",
    "autor" = "autor",
    "album" = "album",
    "dateadded" = "dateadded",
    "duration" = "duration",
}

class Song extends HTMLElement {
    idsong?: number;
    image?: string;
    titlesong?: string;
    autor?: string;
    album?: string;
    dateadded?: any; 
    duration?: string;

    static get observedAttributes() {
        return Object.values(Attribute);
    }

    attributeChangedCallback(propName: Attribute, oldValue: string | undefined, newValue: string | undefined) {
        switch (propName) {
            case Attribute.idsong:
                this.idsong = newValue ? Number(newValue) : undefined;
                break;
                
            default:
                this[propName] = newValue;
                break;
        }
        
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
    }

    //Formatear la fecha, para que se muestra en m, s y h
    formatTimeAgo(dateadded:any) {
        if (!dateadded) return "Fecha no disponible";
    
        const now = new Date();
        const date = new Date(dateadded); 
    
        const secondsElapsed = Math.floor((now.getTime() - date.getTime()) / 1000);
    
        if (secondsElapsed < 60) return `hace ${secondsElapsed}   s`;
        if (secondsElapsed < 3600) return `hace ${Math.floor(secondsElapsed / 60)}  m`;
        if (secondsElapsed < 86400) return `hace ${Math.floor(secondsElapsed / 3600)}   h`;
        const daysElapsed = Math.floor(secondsElapsed / 86400);
        return `hace ${daysElapsed}d`;
    }

    render() {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="../src/components/Song/song.css">
                <div class="song">
                    <div class="perfil">
                        <div id="img">
                            <img src="${this.image}" >
                        </div>
                        <div class="texts">
                            <p>${this.titlesong}</p>
                            <p id="autor">${this.autor}</p>
                        </div>
                    </div>
                    <p class="album">${this.album}</p>
                    <p class="dateadded">${this.formatTimeAgo(this.dateadded)}</p>
                    <p class="duracion">${this.duration}</p>
                </div>
            `;
        }
        
        const cssSong = this.ownerDocument.createElement("style");
        cssSong.innerHTML = styles;
        this.shadowRoot?.appendChild(cssSong);
    }
}

customElements.define("song-commponent", Song);
export default Song;

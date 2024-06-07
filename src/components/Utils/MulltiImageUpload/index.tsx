import { motion } from "framer-motion";
import {FaFileUpload} from "react-icons/fa";
import {ChangeEvent, useEffect, useState} from "react";

const ComponentStyles = {
    container: {
        height: '80px', width: '100%', padding: '4px',
        display:'flex',alignItems:'start',justifyContent:'start'
    }, wrapper: {
        background: 'whitesmoke',
        height: '100%',
        width: '100%',
        borderRadius:'4px',
        display:'flex',
    },
    items:{
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin:'8px',
        border:'1px solid lightgray',
        borderRadius: '8px',
        padding:'0 4px'
    }
}

interface MIU{
    onSelect:(s:string[]) => void
}

export function MultiImageUpload(props:MIU) {
    const [images, setImages] = useState<string[]>([]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        Promise.all(files.map(file => {
            return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = (event) => {
                    resolve(event.target?.result as string);
                };

                reader.onerror = (error) => {
                    reject(error);
                };

                reader.readAsDataURL(file);
            });
        })).then(base64Images => {
            setImages(prevImages => [...prevImages, ...base64Images]);
        }).catch(error => console.error('Error converting to base64:', error));
    };
    useEffect(() => {
              props.onSelect(images)
    }, [images]);
    return (<motion.div initial={{y:10}} animate={{y:0}} style={ComponentStyles.container} className={'wrap'}>
            <div style={ComponentStyles.wrapper}>
                <div style={ComponentStyles.items}><FaFileUpload className={'pointer'} color={'#044a40'} size={28}/>
                    <input type={"file"} multiple={true} onChange={handleFileChange} accept="image/*" />
             </div>
                {images.map((image, index) => (
                    <div style={ComponentStyles.wrapper}>
                    <img key={index} src={image} alt={`Uploaded ${index}`} style={{ width:'100%', height:'100%',padding:"10px",objectFit:'contain'}} />
                    </div>
                ))}
            </div>
    </motion.div>)
}
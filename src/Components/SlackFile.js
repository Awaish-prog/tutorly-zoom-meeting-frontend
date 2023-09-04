import { getSlackFileUrlApi } from "../apiCalls/apiCalls";
import "../CSS/SlackFile.css"
import { FaDownload } from "react-icons/fa"

export default function SlackFile({ file }){

    const handleDownload = async () => {
    //     // Use the URL to download the file
    //     const fileUrlRes = await getSlackFileUrlApi(file.id)
    //     console.log(fileUrlRes);
    };

    console.log(file);

    return <>
        <div onClick={handleDownload}  className="slack-file" >
            {file.name}
            <a href={file.permalink_public ? file.permalink_public : ""} target="_blank" className="download-file">
                <FaDownload />
            </a>
            
        </div>
    </>
}
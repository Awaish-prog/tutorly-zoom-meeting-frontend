import { getSlackFileUrlApi } from "../apiCalls/apiCalls";

export default function SlackFile({ file }){

    const handleDownload = async () => {
        // Use the URL to download the file
        const fileUrlRes = await getSlackFileUrlApi(file.id)
        console.log(fileUrlRes);
    };

    return <>
        <p onClick={handleDownload} >{file.name}</p>
    </>
}
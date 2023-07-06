import './FileDrop.css'
import Dropzone from "react-dropzone";

type Props = {
    handleUpload: (file: any[]) => Promise<void>;
}
const FileDrop = ({handleUpload}: Props) => {
    return (
        <Dropzone onDrop={acceptedFiles => handleUpload(acceptedFiles)}>
            {({getRootProps, getInputProps}) => (
                <>
                    <div {...getRootProps()}>
                        <div className="label-container">
                            <h2 className="label">Upload CSV</h2>
                        </div>
                        <section className="outline">
                            <p>Drop file here, or click to upload</p>
                            <input {...getInputProps()} />
                        </section>
                    </div>
                </>

            )}
        </Dropzone>
    )
}

export default FileDrop;

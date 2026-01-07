const { default: ReceiptUpload } = require("@/components/ReceiptUpload")

const UploadPage = () => {
    return(<div className="upload-page">
        <ReceiptUpload/>
    </div>)
}

export default UploadPage;
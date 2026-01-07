const { default: ReceiptUpload } = require("@/components/ReceiptUpload")

import HeroSectionTwo from '@/components/HeroSectionTwo';
import siteData from '@/data/siteData.json';

const UploadPage = () => {
    const upload_page = siteData[8].upload_page;
    const hero_section = upload_page.hero_section;


    return(<div className="upload-page">
        <HeroSectionTwo data={hero_section}/>
        <ReceiptUpload/>
    </div>)
}

export default UploadPage;
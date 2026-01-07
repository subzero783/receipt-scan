const { default: ReceiptUpload } = require("@/components/ReceiptUpload")

import HeroSectionTwo from '@/components/HeroSectionTwo';
import siteData from '@/data/siteData.json';

const UploadPage = () => {
    const upload_page = siteData[8].upload_page;
    const hero_section = upload_page.hero_section;
    const top_text = upload_page.drag_and_drop_area.top_text;


    return(<div className="upload-page">
        <HeroSectionTwo data={hero_section}/>
        <ReceiptUpload top_text={top_text} />
    </div>)
}

export default UploadPage;
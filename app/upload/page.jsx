const { default: ReceiptUpload } = require("@/components/ReceiptUpload")

import HeroSectionTwo from '@/components/HeroSectionTwo';
import siteData from '@/data/siteData.json';
import UploadReceiptSteps from '@/components/UploadReceiptSteps';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const UploadPage = async () => {
    const session = await getServerSession();
    if (!session) {
        redirect("/login");
    }

    const upload_page = siteData.find(item => item.upload_page)?.upload_page;
    const hero_section = upload_page.hero_section;
    const drag_and_drop_area = upload_page.drag_and_drop_area;
    const how_it_works = upload_page.how_it_works;

    return(
        <div className="upload-page">
            <HeroSectionTwo data={hero_section}/>
            <ReceiptUpload data={drag_and_drop_area} />
            <UploadReceiptSteps data={how_it_works} />
        </div>
    );
}

export default UploadPage;
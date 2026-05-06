import siteData from "@/data/siteData.js";
import HeroSection from "@/components/HeroSection";
import CallToActionTwo from "@/components/CallToActionTwo";
import TwoColumns from "@/components/TwoColumns";
import ToolsSection from "@/components/ToolsSection";
import { IoDocumentTextOutline } from "react-icons/io5";
import { FiUpload } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import ReceiptsManagedTaxesConquered from "@/components/ReceiptsManagedTaxesConquered";


const FeaturesPage = () => {

  const featuresData = siteData.find(item => item.features_page)?.features_page;

  if (!featuresData) return <div>Loading...</div>;

  const hero_section = featuresData.hero_section;
  const extraction_description_section = featuresData.extraction_description_section;
  const categorize_expenses = featuresData.categorize_expenses;
  const receipts_managed_taxes_conquered = featuresData.receipts_managed_taxes_conquered;
  const capture_data_instantly = featuresData.capture_data_instantly;
  const let_ai_do_the_sorting = featuresData.let_ai_do_the_sorting;
  const turn_expenses_into_billable_invoices = featuresData.turn_expenses_into_billable_invoices;
  const your_data = featuresData.your_data;
  const forward_emails = featuresData.forward_emails;
  const tools = featuresData.tools;
  const export_and_invoice = featuresData.export_and_invoice;
  const cta = featuresData.cta;

  return (
    <div className="features_page">
      <HeroSection data={hero_section} />

      <ReceiptsManagedTaxesConquered data={receipts_managed_taxes_conquered} />

      <ToolsSection data={tools} />

      <TwoColumns data={extraction_description_section} text_direction="left" icon={<FiUpload />} background_color={"var(--color-third)"} bottom_border={true} small_title_margin={true} />

      <TwoColumns data={categorize_expenses} text_direction="left" section_class="categorize_expenses" icon={<LuBrain />} background_color={"var(--color-third)"} bottom_border={true} small_title_margin={true} />

      <TwoColumns data={export_and_invoice} text_direction="left" section_class="categorize_expenses" icon={<IoDocumentTextOutline />} background_color={"var(--color-third)"} small_title_margin={true} />

      <TwoColumns data={capture_data_instantly} text_direction="left" section_class="capture_data_instantly" background_color={"var(--color-secondary)"} />

      <TwoColumns data={let_ai_do_the_sorting} text_direction="right" section_class="let_ai_do_the_sorting" background_color={"var(--color-white)"} />

      <TwoColumns data={turn_expenses_into_billable_invoices} text_direction="left" section_class="turn_expenses_into_billable_invoices" background_color={"var(--color-secondary)"} />

      <TwoColumns data={your_data} text_direction="right" section_class="your_data" background_color={"var(--color-white)"} />

      <TwoColumns data={forward_emails} text_direction="left" section_class="forward_emails" background_color={"var(--color-secondary)"} />

      <CallToActionTwo data={cta} />
    </div>
  )
};

export default FeaturesPage;

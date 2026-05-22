import siteData from '@/data/siteData.js';
import SignUpForm from "@/components/SignUpForm";

const signup_data = siteData.find(item => item.signup_page)?.signup_page;
const faqs = siteData.find(item => item.faqs)?.faqs;

export async function generateMetadata() {
  return {
    title: signup_data?.meta_data?.title
      ? `${signup_data.meta_data.title}`
      : "Receipt Scan - Expense Tracker for Freelancers",
    description: signup_data?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
  };
}

const SignupPage = () => {
  if (!signup_data) return <div>Loading...</div>;

  return <SignUpForm signup_data={signup_data} faqs={faqs} />;
};

export default SignupPage;
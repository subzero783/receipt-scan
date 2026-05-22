import siteData from '@/data/siteData.js';
import SignInForm from "@/components/SignInForm";

const signin_data = siteData.find(item => item.signin_page)?.signin_page;

export async function generateMetadata() {
  return {
    title: signin_data?.meta_data?.title
      ? `${signin_data.meta_data.title}`
      : "Receipt Scan - Expense Tracker for Freelancers",
    description: signin_data?.meta_data?.description || "Automated expense tracking for freelancers and small businesses",
  };
}

const LoginPage = () => {
  if (!signin_data) return <div>Loading...</div>;

  return <SignInForm signin_data={signin_data} />;
};

export default LoginPage;

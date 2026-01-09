import { FaCloudUploadAlt, FaRobot, FaCheckCircle } from 'react-icons/fa';

const iconMap = {
  "cloud-upload": <FaCloudUploadAlt size={32} color={`var(--color-white)`} />,
  "robot": <FaRobot size={32} color={`var(--color-white)`} />,
  "check-circle": <FaCheckCircle size={32} color={`var(--color-white)`} />
};

const UploadReceiptSteps = ({data}) => {
    const {small_title, title, subtitle, steps} = data;
    
    return(
        <div className="upload-receipt-steps">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="top-text">
                            <p className="small-title">{small_title}</p>
                            <h2 className="title">{title}</h2>
                            <p className="subtitle">{subtitle}</p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className="steps">
                            {steps.map((step) => (
                                <div className="step" key={step.id}>
                                    <div className="icon-container">
                                        {iconMap[step.icon]}
                                    </div>
                                    <h3 className="step-title">{step.id}. {step.title}</h3>
                                    <p className="step-text">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UploadReceiptSteps;
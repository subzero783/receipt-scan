const AccountSettings = () => {
    return (
        <section className="account-settings-section">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h3 className="column-title">Photo Upload</h3>
                        <p className="column-subtitle">Upload your photo here.</p>
                    </div>
                    <div className="col">
                        {/* Add a way for the user to change the profile photo */}
                        <div className="profile-photo">
                            <img src="/profile-photo.png" alt="" />
                        </div>
                        <div className="profile-photo-upload">
                            <input type="file" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AccountSettings;
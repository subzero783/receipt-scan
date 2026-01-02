const AuthorBio = ({ author }) => {
    if (!author) return null;

    return (
        <div className="author-bio-container">
            <div className="author-avatar">
                <div className="placeholder-avatar">
                    {author.name?.charAt(0) || "A"}
                </div>
            </div>
            <div className="author-info">
                <h3>{author.name}</h3>
                <p className="author-role">{author.role || "Content Writer"}</p>
                <p className="author-description">
                    {author.bio || `Passionate about helping freelancers and small businesses manage their expenses efficiently.`}
                </p>
            </div>
        </div>
    );
};

export default AuthorBio;

import React, { useState, useEffect } from "react";
import { MdPerson, MdEmail, MdPhone, MdEdit, MdSave, MdClose, MdBadge } from "react-icons/md";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./Profile.css";

const Profile = ({ user }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "",
    phone: "",
    bio: "",
    joinedAt: "",
  });
  const [draft, setDraft] = useState({ ...profile });

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const ref = doc(db, "userProfiles", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setDraft(data);
      } else {
        const defaultData = {
          displayName: user.displayName || "",
          phone: "",
          bio: "",
          joinedAt: new Date().toLocaleDateString("en-IN", {
            year: "numeric", month: "long", day: "numeric"
          }),
        };
        setProfile(defaultData);
        setDraft(defaultData);
      }
    };

    loadProfile();
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "userProfiles", user.uid);
      await setDoc(ref, draft, { merge: true });
      setProfile(draft);
      setEditing(false);
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  if (!user) return <div className="Container"><p>Please login first.</p></div>;

  const initials = (profile.displayName || user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="Profile-Container">
      <h1>My Profile</h1>
      <p>Manage your personal information</p>

      <div className="profile-card">
        {/* Avatar */}
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt="profile" />
            ) : (
              <span className="avatar-initials">{initials}</span>
            )}
          </div>
          <div className="profile-name-block">
            <h2>{profile.displayName || user.displayName || "User"}</h2>
            <span className="profile-badge">Budget Tracker Member</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="profile-info-grid">
          <div className="profile-field">
            <MdBadge className="field-icon" />
            <div className="field-body">
              <label>Name</label>
              {editing ? (
                <input
                  className="profile-input"
                  value={draft.displayName}
                  onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
                  placeholder="Your name"
                />
              ) : (
                <span>{profile.displayName || "—"}</span>
              )}
            </div>
          </div>

          <div className="profile-field">
            <MdEmail className="field-icon" />
            <div className="field-body">
              <label>Email Address</label>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="profile-field">
            <MdPhone className="field-icon" />
            <div className="field-body">
              <label>Phone Number</label>
              {editing ? (
                <input
                  className="profile-input"
                  type="number"
                  value={draft.phone}
                  onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                />
              ) : (
                <span>{profile.phone || "—"}</span>
              )}
            </div>
          </div>

          <div className="profile-field profile-field-full">
            <MdPerson className="field-icon" />
            <div className="field-body">
              <label>Bio</label>
              {editing ? (
                <textarea
                  className="profile-input profile-textarea"
                  value={draft.bio}
                  onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                  placeholder="Tell something about yourself..."
                  rows={3}
                />
              ) : (
                <span>{profile.bio || "—"}</span>
              )}
            </div>
          </div>
        </div>

        {/* Joined */}
        {profile.joinedAt && (
          <p className="profile-joined">Member since: {profile.joinedAt}</p>
        )}

        {/* Action Buttons */}
        <div className="profile-actions">
          {editing ? (
            <>
              <button className="profile-btn save-btn" onClick={handleSave} disabled={saving}>
                <MdSave /> {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="profile-btn cancel-btn" onClick={handleCancel}>
                <MdClose /> Cancel
              </button>
            </>
          ) : (
            <button className="profile-btn edit-btn" onClick={() => setEditing(true)}>
              <MdEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';

function App() {
  const [friendInfo, setFriendInfo] = useState(null);
  const [category, setCategory] = useState('colleague');
  const [file, setFile] = useState(null);
  const [galleryData, setGalleryData] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const API_URL = 'http://localhost:5000';

  const fetchFriend = async () => {
    try {
      const res = await fetch(`${API_URL}/friend`);
      const data = await res.json();
      setFriendInfo(data);
    } catch (err) {
      alert('에러: ' + err.message);
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      alert('업로드 완료: ' + data.message);
    } catch (err) {
      alert('에러: ' + err.message);
    }
  };

  const fetchGallery = async (cat) => {
    try {
      const res = await fetch(`${API_URL}/gallery/${cat}`);
      const data = await res.json();
      setGalleryData({ category: cat, images: data.images || [] });
      setCurrentView('gallery');
    } catch (err) {
      alert('에러: ' + err.message);
    }
  };

  const fetchAllGallery = async () => {
    try {
      const all = {};
      for (const cat of ['colleague', 'family', 'etc']) {
        const res = await fetch(`${API_URL}/gallery/${cat}`);
        const data = await res.json();
        all[cat] = data.images || [];
      }
      setGalleryData({ category: 'all', data: all });
      setCurrentView('gallery');
    } catch (err) {
      alert('에러: ' + err.message);
    }
  };

  const categoryNames = {
    colleague: 'Colleague (동료)',
    family: 'Family (가족)',
    etc: 'Etc (기타)'
  };

  // 홈 화면
  if (currentView === 'home') {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '700px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{
            color: '#333',
            textAlign: 'center',
            marginBottom: '10px'
          }}>K8s Image Gallery</h1>
          <div style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '30px'
          }}>Image Gallery with Microservices</div>

          {/* 친구 정보 */}
          <div style={{
            borderLeft: '4px solid #4CAF50',
            paddingLeft: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              fontSize: '1.1em',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '5px'
            }}>User Information</div>
            <div style={{
              color: '#666',
              fontSize: '0.9em',
              marginBottom: '15px'
            }}>Fetch user profile data from API</div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={fetchFriend} style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}>Get User Info</button>
            </div>
            {friendInfo && (
              <pre style={{
                backgroundColor: '#f4f4f4',
                padding: '15px',
                borderRadius: '5px',
                marginTop: '10px',
                fontSize: '13px',
                overflowX: 'auto'
              }}>{JSON.stringify(friendInfo, null, 2)}</pre>
            )}
          </div>

          <hr style={{
            border: 'none',
            borderTop: '1px solid #eee',
            margin: '25px 0'
          }} />

          {/* 이미지 업로드 */}
          <div style={{
            borderLeft: '4px solid #4CAF50',
            paddingLeft: '15px',
            marginBottom: '30px'
          }}>
            <div style={{
              fontSize: '1.1em',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '5px'
            }}>Image Upload</div>
            <div style={{
              color: '#666',
              fontSize: '0.9em',
              marginBottom: '15px'
            }}>Upload images to different categories</div>
            
            <form onSubmit={uploadFile} style={{ marginTop: '15px' }}>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#666',
                fontWeight: 'bold'
              }}>Category:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{
                width: '100%',
                padding: '10px',
                marginBottom: '20px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxSizing: 'border-box'
              }}>
                <option value="colleague">Colleague</option>
                <option value="family">Family</option>
                <option value="etc">Etc</option>
              </select>
              
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#666',
                fontWeight: 'bold'
              }}>File:</label>
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files[0])} 
                required 
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  boxSizing: 'border-box'
                }}
              />
              
              <button type="submit" style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px'
              }}>Upload</button>
            </form>
          </div>

          <hr style={{
            border: 'none',
            borderTop: '1px solid #eee',
            margin: '25px 0'
          }} />

          {/* 갤러리 */}
          <div style={{
            borderLeft: '4px solid #4CAF50',
            paddingLeft: '15px'
          }}>
            <div style={{
              fontSize: '1.1em',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '5px'
            }}>Image Gallery</div>
            <div style={{
              color: '#666',
              fontSize: '0.9em',
              marginBottom: '15px'
            }}>Browse images by category</div>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button onClick={fetchAllGallery} style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '5px'
              }}>All Gallery</button>
              <button onClick={() => fetchGallery('colleague')} style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '5px'
              }}>Colleague</button>
              <button onClick={() => fetchGallery('family')} style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '5px'
              }}>Family</button>
              <button onClick={() => fetchGallery('etc')} style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                margin: '5px'
              }}>Etc</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 갤러리 화면
  if (currentView === 'gallery') {
    return (
      <div style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '1000px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <button onClick={() => setCurrentView('home')} style={{
            padding: '10px 20px',
            backgroundColor: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}>← Back to Home</button>

          {galleryData.category === 'all' ? (
            // 전체 갤러리
            <>
              <h2 style={{
                color: '#333',
                borderBottom: '3px solid #4CAF50',
                paddingBottom: '10px',
                marginBottom: '10px'
              }}>All Gallery</h2>
              <div style={{
                color: '#666',
                fontSize: '0.9em',
                marginBottom: '30px'
              }}>Total: {Object.values(galleryData.data).flat().length} images</div>

              {['colleague', 'family', 'etc'].map(cat => (
                <div key={cat} style={{ marginBottom: '40px' }}>
                  <h3 style={{
                    color: '#555',
                    borderLeft: '4px solid #4CAF50',
                    paddingLeft: '10px',
                    marginBottom: '15px'
                  }}>{categoryNames[cat]} ({galleryData.data[cat].length})</h3>
                  
                  {galleryData.data[cat].length === 0 ? (
                    <div style={{
                      color: '#999',
                      fontStyle: 'italic',
                      padding: '20px',
                      textAlign: 'center',
                      backgroundColor: '#f9f9f9',
                      borderRadius: '5px'
                    }}>No images in this category</div>
                  ) : (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                      gap: '15px'
                    }}>
                      {galleryData.data[cat].map(img => (
                        <div key={img} style={{
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          padding: '10px',
                          backgroundColor: '#fafafa'
                        }}>
                          <img 
                            src={`${API_URL}/uploads/${cat}/${img}`} 
                            alt={img}
                            style={{
                              width: '100%',
                              height: '150px',
                              objectFit: 'cover',
                              borderRadius: '5px'
                            }}
                          />
                          <div style={{
                            marginTop: '10px',
                            fontSize: '0.8em',
                            color: '#666',
                            textAlign: 'center',
                            wordBreak: 'break-all'
                          }}>{img}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            // 카테고리별 갤러리
            <>
              <h2 style={{
                color: '#333',
                borderBottom: '3px solid #4CAF50',
                paddingBottom: '10px',
                marginBottom: '10px'
              }}>{categoryNames[galleryData.category]} Gallery</h2>
              <div style={{
                color: '#666',
                fontSize: '0.9em',
                marginBottom: '20px'
              }}>Total: {galleryData.images.length} images</div>

              {galleryData.images.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#666',
                  padding: '40px 0'
                }}>No images uploaded yet.</div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '20px',
                  marginTop: '20px'
                }}>
                  {galleryData.images.map(img => (
                    <div key={img} style={{
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      padding: '10px',
                      backgroundColor: '#fafafa'
                    }}>
                      <img 
                        src={`${API_URL}/uploads/${galleryData.category}/${img}`} 
                        alt={img}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover',
                          borderRadius: '5px'
                        }}
                      />
                      <div style={{
                        marginTop: '10px',
                        fontSize: '0.85em',
                        color: '#666',
                        textAlign: 'center',
                        wordBreak: 'break-all'
                      }}>{img}</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <div style={{
            textAlign: 'center',
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #eee'
          }}>
            <button onClick={() => setCurrentView('home')} style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}>Home</button>
            <button onClick={fetchAllGallery} style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}>All</button>
            <button onClick={() => fetchGallery('colleague')} style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}>Colleague</button>
            <button onClick={() => fetchGallery('family')} style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}>Family</button>
            <button onClick={() => fetchGallery('etc')} style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}>Etc</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

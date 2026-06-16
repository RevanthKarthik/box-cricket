import {
  useEffect,
  useState,
} from "react";

import Navbar from "../components/Navbar";
import api from "../services/api";

export default function Gallery() {
  const [images, setImages] =
    useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages =
    async () => {
      try {
        const res =
          await api.get(
            "/gallery"
          );

        setImages(
          res.data
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        <h2 className="mb-4">
          RK Box Cricket Gallery
        </h2>

        <div className="row">

          {images.map(
            (image) => (
              <div
                key={
                  image._id
                }
                className="col-md-4 mb-4"
              >
                <div className="card shadow">

                  <img
                    src={
                      image.imageUrl
                    }
                    alt="gallery"
                    className="card-img-top"
                    style={{
                      height:
                        "300px",
                      objectFit:
                        "cover",
                    }}
                  />

                </div>
              </div>
            )
          )}

        </div>

      </div>
    </>
  );
}
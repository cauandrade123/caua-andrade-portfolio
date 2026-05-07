import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import badgeImg from "../../public/badgee.png"

export default function CertificationsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const meta = [
    { label: "Achieved", value: "2026" },
    { label: "Issuer", value: "Microsoft" },
    { label: "Credential", value: "AI-900" },
    { label: "Domain", value: "Artificial Intelligence" },
  ];

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.2,
      },
    },
  };

  const itemImposing = {
    hidden: {
      opacity: 0,
      y: 80,
      rotateX: 10,
      scale: 0.95,
      filter: "blur(8px)",
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <>
      <style>{`
        .cert-section {
          background: #f5f6f8;
          padding: 100px 80px 110px;
          font-family: 'Roboto', sans-serif;
          overflow: hidden;
          perspective: 1200px;
          position: relative;
        }
        .cert-row {
          display: flex;
          align-items: flex-start;
          gap: 72px;
          padding: 60px 0;
          border-top: 1px solid rgba(15,22,35,.07);
          border-bottom: 1px solid rgba(15,22,35,.07);
        }
        .cert-badge-box {
          position: relative;
          width: 240px;
          height: 240px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cert-title {
          font-size: 28px;
        }
        .cert-description {
          font-size: 15px;
          max-width: 600px;
        }
        .cert-meta-value {
          font-size: 15px;
        }

        @media (max-width: 900px) {
          .cert-section {
            padding: 72px 40px 80px;
          }
          .cert-row {
            gap: 48px;
          }
          .cert-badge-box {
            width: 180px;
            height: 180px;
          }
        }

        @media (max-width: 640px) {
          .cert-section {
            padding: 56px 24px 64px;
          }
          .cert-row {
            flex-direction: column;
            align-items: center;
            gap: 36px;
            padding: 40px 0;
          }
          .cert-badge-box {
            width: 160px;
            height: 160px;
          }
          .cert-title {
            font-size: 22px;
            text-align: center;
          }
          .cert-description {
            font-size: 13.5px;
            max-width: 100%;
            text-align: center;
          }
          .cert-info-inner {
            align-items: center !important;
          }
          .cert-accent {
            margin: 0 auto;
          }
          .cert-meta-row {
            flex-wrap: wrap;
            gap: 20px 0;
            justify-content: center;
          }
          .cert-meta-block {
            min-width: 50%;
            border-right: none !important;
            padding: 0 !important;
            align-items: center !important;
          }
          .cert-meta-block:nth-child(odd) {
            padding-right: 16px !important;
            border-right: 1px solid rgba(15,22,35,.07) !important;
          }
          .cert-meta-value {
            font-size: 13px;
          }
          .cert-cred-link {
            justify-content: center;
          }
          .cert-label-p, .cert-h2 {
            text-align: center;
          }
        }

        @media (max-width: 400px) {
          .cert-badge-box {
            width: 130px;
            height: 130px;
          }
          .cert-title {
            font-size: 20px;
          }
        }
      `}</style>

      <section ref={ref} className="cert-section">
        {/* 🎬 Cortina de entrada Dramática */}
        <motion.div
          initial={{ scaleY: 1 }}
          animate={isInView ? { scaleY: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.87, 0, 0.13, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            background: "#f5f6f8",
            transformOrigin: "top",
            zIndex: 5,
          }}
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Label */}
          <motion.p
            variants={itemImposing}
            className="cert-label-p"
            style={{
              fontSize: 12,
              fontWeight: 300,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#9aa0ad",
              marginBottom: 16,
            }}
          >
            Certificações
          </motion.p>

          {/* Title */}
          <motion.h2
            variants={itemImposing}
            className="cert-h2"
            style={{
              fontSize: 42,
              fontWeight: 100,
              color: "#0f1623",
              letterSpacing: "-0.02em",
              marginBottom: 72,
            }}
          >
            Credenciais &{" "}
            <span style={{ fontWeight: 100, color: "#3a5a8a" }}>
              Conquistas
            </span>
          </motion.h2>

          {/* Row */}
          <motion.div variants={itemImposing} className="cert-row">

            {/* Badge Section */}
            <div style={{ flexShrink: 0, position: "relative", paddingTop: 6 }}>
              {/* Glow Pulsante */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: -40,
                  borderRadius: "50%",
                  background: "radial-gradient(circle at center, rgba(0,120,212,0.12), transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <motion.div
                whileHover={{ y: -12, scale: 1.06, rotateY: 8 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="cert-badge-box"
              >
                {/* Reflexo Interno */}
                <motion.div
                  animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                  transition={{
                    duration: 2.2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(120deg, transparent 35%, rgba(255, 255, 255, 0.63) 50%, transparent 65%)",
                    backgroundSize: "200% 100%",
                    pointerEvents: "none",
                    zIndex: 2,
                    WebkitMaskImage: `url(${badgeImg})`,
                    maskImage: `url(${badgeImg})`,
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    mixBlendMode: "overlay"
                  }}
                />

                <img
                  src={badgeImg}
                  alt="Microsoft Azure AI Fundamentals"
                  style={{
                    width: "93%",
                    height: "90%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 15px 30px rgba(0,90,180,0.12))"
                  }}
                />
              </motion.div>
            </div>

            {/* Info Section */}
            <div
              className="cert-info-inner"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 26,
                paddingTop: 4,
                alignItems: "flex-start",
              }}
            >
              <p className="cert-title" style={{ fontWeight: 100, color: "#0f1623", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Microsoft Azure AI Fundamentals
              </p>

              <div
                className="cert-accent"
                style={{
                  width: 40,
                  height: 2,
                  background: "linear-gradient(90deg, rgba(0,120,212,.35), transparent)",
                }}
              />

              <p
                className="cert-description"
                style={{
                  fontWeight: 300,
                  color: "#6b7280",
                  lineHeight: 1.8,
                }}
              >
                Certificação que valida o conhecimento em conceitos fundamentais de inteligência
                artificial e machine learning na plataforma Azure. Abrange serviços cognitivos,
                visão computacional, processamento de linguagem natural e princípios de IA responsável.
              </p>

              <div className="cert-meta-row" style={{ display: "flex", alignItems: "flex-start" }}>
                {meta.map((item, i) => (
                  <div
                    key={item.label}
                    className="cert-meta-block"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      padding: i === 0 ? "0 30px 0 0" : "0 30px",
                      borderRight:
                        i < meta.length - 1
                          ? "1px solid rgba(15,22,35,.07)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 300,
                        letterSpacing: "0.25em",
                        textTransform: "uppercase",
                        color: "#b0b7c3",
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="cert-meta-value"
                      style={{
                        fontWeight: 300,
                        color: "#2d3748",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="https://learn.microsoft.com/api/credentials/share/pt-br/CauAndradeCond-4822/CF002D7D8DAF3171?sharingId=E7D20FD6D1254346"
                target="_blank"
                rel="noopener noreferrer"
                className="cert-cred-link"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13.5,
                  fontWeight: 300,
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                  background: "linear-gradient(90deg, #1a6fc4, #3a9bd5)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  transition: "opacity .2s, gap .2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "0.75";
                  e.currentTarget.style.gap = "12px";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.gap = "8px";
                }}
              >
                Ver credencial
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="arrowGrad" x1="0" y1="0" x2="14" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1a6fc4"/>
                      <stop offset="100%" stopColor="#3a9bd5"/>
                    </linearGradient>
                  </defs>
                  <path d="M2.5 7H11.5M11.5 7L8 3.5M11.5 7L8 10.5" stroke="url(#arrowGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
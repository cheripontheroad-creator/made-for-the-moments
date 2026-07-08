/* ================================
   ORDER WIZARD SECTION
================================ */

.order-section {
  background: #fff7fb;
  padding: 70px 20px;
}

.wizard-shell {
  max-width: 1320px;
  margin: 0 auto;
}

.form-heading {
  text-align: center;
  max-width: 850px;
  margin: 0 auto 45px;
}

.form-heading h2 {
  font-size: clamp(2.1rem, 4vw, 3.3rem);
  color: #251d2b;
  margin: 10px 0 12px;
  letter-spacing: -0.04em;
}

.form-heading p {
  color: #5f5265;
  line-height: 1.7;
  font-size: 1.1rem;
}

.wizard-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 26px;
  align-items: start;
}

.wizard-form {
  min-width: 0;
}

.wizard-progress {
  background: #ffffff;
  border: 1px solid #eadde7;
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 12px 30px rgba(74, 38, 70, 0.08);
  margin-bottom: 22px;
}

.progress-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  font-weight: 800;
  color: #7b2c58;
  margin-bottom: 12px;
}

.progress-bar {
  height: 12px;
  background: #f5d9e7;
  border-radius: 999px;
  overflow: hidden;
}

#progressFill {
  height: 100%;
  width: 0;
  background: #d94370;
  border-radius: 999px;
  transition: width 0.25s ease;
}

.wizard-step {
  display: none;
}

.wizard-step.active {
  display: block;
}

.question-card,
.wizard-summary {
  background: #ffffff;
  border: 1px solid #eadde7;
  border-radius: 24px;
  box-shadow: 0 18px 44px rgba(74, 38, 70, 0.10);
}

.question-card {
  padding: clamp(26px, 5vw, 46px);
}

.step-eyebrow {
  display: inline-block;
  background: #ffdbe7;
  color: #b91f52;
  padding: 9px 20px;
  border-radius: 999px;
  font-weight: 900;
  margin: 0 0 18px;
}

.question-card h3 {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  line-height: 1.05;
  margin: 0 0 18px;
  color: #251d2b;
  letter-spacing: -0.045em;
}

.question-help,
.field-description {
  color: #5f5265;
  line-height: 1.65;
  margin: 0 0 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 22px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 800;
  color: #251d2b;
}

input,
select,
textarea {
  width: 100%;
  padding: 16px 18px;
  border: 1px solid #d7cbd4;
  border-radius: 14px;
  font-size: 1rem;
  font-family: inherit;
  background: #ffffff;
}

textarea {
  min-height: 135px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #d94370;
  box-shadow: 0 0 0 4px rgba(217, 67, 112, 0.16);
}

.required {
  color: #c0392b;
}

.gift-option {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 18px;
  align-items: center;
  padding: 20px;
  margin-bottom: 16px;
  border: 2px solid #eadde7;
  border-radius: 18px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.25s ease;
}

.gift-option:hover {
  border-color: #d94370;
  transform: translateY(-2px);
}

.featured-gift {
  background: #fff3f9;
  border-color: #d94370;
}

.gift-content strong {
  display: block;
  font-size: 1.18rem;
  color: #251d2b;
}

.gift-content small {
  display: block;
  margin-top: 6px;
  color: #5f5265;
  line-height: 1.45;
}

.gift-price {
  font-weight: 900;
  font-size: 1.25rem;
  color: #7b2c58;
}

.delivery-box,
.ideas-box {
  background: #fff8ef;
  border-left: 5px solid #d48bb4;
  padding: 22px;
  border-radius: 16px;
  margin: 24px 0;
}

.delivery-box h4,
.ideas-box h4 {
  margin: 0 0 10px;
  color: #7b2c58;
  font-size: 1.2rem;
}

.delivery-box p {
  color: #5f5265;
  line-height: 1.65;
}

.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.ideas-grid div {
  background: #ffffff;
  border-radius: 10px;
  padding: 10px 12px;
  color: #444;
}

.conditional-inline {
  margin: 16px 0 22px;
  background: #fff8ef;
  border-left: 4px solid #d48bb4;
  padding: 18px;
  border-radius: 12px;
}

input[type="file"] {
  background: #fff8ef;
  border: 2px dashed #d48bb4;
  padding: 20px;
  cursor: pointer;
}

.terms-check {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: start;
  gap: 12px;
  background: #fff7fb;
  border-radius: 14px;
  padding: 18px;
  margin: 24px 0;
  font-weight: 600;
  line-height: 1.5;
}

.terms-check input {
  width: auto;
  margin-top: 4px;
}

.pay-button,
.wizard-btn {
  display: inline-block;
  text-align: center;
  text-decoration: none;
  border: none;
  border-radius: 999px;
  padding: 16px 34px;
  font-weight: 900;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all .25s ease;
}

.pay-button {
  background: #22c55e;
  color: #ffffff !important;
  box-shadow: 0 10px 24px rgba(34,197,94,.35);
}

.pay-button:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(34,197,94,.45);
}

.pay-button.disabled {
  background: #bfbfbf;
  color: #ffffff !important;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
}

.wizard-nav {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 22px;
}

.wizard-btn.primary {
  background: #d94370;
  color: #ffffff;
}

.wizard-btn.secondary {
  background: #ffffff;
  color: #7b2c58;
  border: 2px solid #d48bb4;
}

.wizard-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.wizard-summary {
  padding: 26px;
  position: sticky;
  top: 20px;
}

.wizard-summary h3 {
  margin: 0 0 18px;
  color: #7b2c58;
  font-size: 1.45rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #eadde7;
}

.answer-list p {
  margin: 13px 0;
  line-height: 1.45;
}

.answer-list span {
  color: #5f5265;
}

@media (max-width: 1000px) {
  .wizard-layout {
    display: flex;
    flex-direction: column;
  }

  .wizard-form {
    order: 1;
    width: 100%;
  }

  .wizard-summary {
    order: 2;
    position: static;
    width: 100%;
    margin-top: 28px;
  }
}

@media (max-width: 700px) {
  .order-section {
    padding: 50px 14px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .gift-option {
    grid-template-columns: auto 1fr;
  }

  .gift-price {
    grid-column: 2;
  }

  .wizard-nav {
    flex-direction: column-reverse;
  }

  .wizard-btn,
  .pay-button {
    width: 100%;
  }
}

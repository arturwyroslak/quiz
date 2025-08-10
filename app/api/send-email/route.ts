import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate required fields
    const { companyName, contactPerson, email, phone, message } = data;
    if (!companyName || !contactPerson || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Wszystkie wymagane pola muszą być wypełnione' },
        { status: 400 }
      );
    }

    // Create transporter with your SMTP settings
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Format interest areas for email
    const interestAreas = [];
    
    // Add debugging to see what's coming in
    console.log('Interest areas from form:', {
      '3d': data.interestArea_3d,
      'virtualTours': data.interestArea_virtualTours,
      'interiorDesign': data.interestArea_interiorDesign,
      'homeStaging': data.interestArea_homeStaging,
      'partnerProgram': data.interestArea_partnerProgram
    });
    
    if (data.interestArea_3d === true) interestAreas.push('Wizualizacje 3D');
    if (data.interestArea_virtualTours === true) interestAreas.push('Wirtualne spacery');
    if (data.interestArea_interiorDesign === true) interestAreas.push('Projektowanie wnętrz');
    if (data.interestArea_homeStaging === true) interestAreas.push('Home Staging');
    if (data.interestArea_partnerProgram === true) interestAreas.push('Program Partnerski');

    // Prepare email content
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_TO_EMAIL,
      subject: `Nowe zapytanie od ${companyName}`,
      html: `
        <h2>Nowe zapytanie z formularza kontaktowego</h2>
        <p><strong>Nazwa firmy:</strong> ${companyName}</p>
        <p><strong>Osoba kontaktowa:</strong> ${contactPerson}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Obszary zainteresowania:</strong> ${interestAreas.length > 0 ? interestAreas.join(', ') : 'Nie wybrano'}</p>
        <h3>Wiadomość:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas wysyłania wiadomości' },
      { status: 500 }
    );
  }
} 
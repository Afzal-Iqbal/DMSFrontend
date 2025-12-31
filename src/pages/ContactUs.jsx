import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactUs = () => {
    // We'll use a simple mailto for now as requested for "direct" email from client
    // Or we could use a backend endpoint if they had one, but mailto is safest for "direct" without server config.
    // Actually, "send email directly" usually implies a backend form.
    // However, without SMTP credentials provided by USER, I cannot setup a real backend mailer easily.
    // I will simulate the form submission and open the user's email client.

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            message: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            message: Yup.string().required('Message is required'),
        }),
        onSubmit: (values) => {
            const subject = `Inquiry from ${values.name}`;
            const body = `Name: ${values.name}%0D%0AEmail: ${values.email}%0D%0A%0D%0AMessage:%0D%0A${values.message}`;
            window.location.href = `mailto:afzalxdreader@gmail.com?subject=${subject}&body=${body}`;
        },
    });

    const openWhatsApp = () => {
        const phone = "923042279512"; // Country code 92, drop 0
        const message = "Hello, I have an inquiry regarding DonationHub.";
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Inter']">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[#13ec6d] font-black uppercase tracking-widest text-xs mb-2 block animate-pulse">Get in Touch</span>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    Contact <span className="text-slate-500">Us</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    Have questions or want to visit us? We are here to help you make a difference.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Contact Info Side */}
                <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="bg-white dark:bg-[#111c16] p-8 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Contact Information</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="size-10 bg-[#13ec6d]/10 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[#13ec6d]">location_on</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Our Location</p>
                                    <p className="text-slate-900 dark:text-slate-200 font-medium">XYZ Area, Karachi, Pakistan</p>
                                    <p className="text-xs text-slate-500 mt-1">Visit us for clarification and support.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="size-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-blue-500">mail</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Email Us</p>
                                    <a href="mailto:afzalxdreader@gmail.com" className="text-slate-900 dark:text-slate-200 font-medium hover:text-[#13ec6d] transition-colors">
                                        afzalxdreader@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="size-10 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-green-500">call</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest mb-1">Call / WhatsApp</p>
                                    <p className="text-slate-900 dark:text-slate-200 font-medium">+92 304 2279512</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={openWhatsApp}
                                className="w-full h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#25D366]/20"
                            >
                                <span className="material-symbols-outlined text-[24px]">chat</span>
                                Chat on WhatsApp
                            </button>
                        </div>
                    </div>

                    {/* Map Placeholder */}
                    <div className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <span className="material-symbols-outlined">map</span>
                                Map View Loading...
                            </p>
                        </div>
                        {/* In a real app, embed Google Maps iframe here */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d924234.6302710465!2d66.59495074892502!3d25.193389469850784!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e06651d4bbf%3A0x9cf92f44555a0c23!2sKarachi%2C%20Karachi%20City%2C%20Sindh%2C%20Pakistan!5e0!3m2!1sen!2s!4v1703844000000!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity"
                        ></iframe>
                    </div>
                </div>

                {/* Form Side */}
                <div className="bg-white dark:bg-[#111c16] p-8 sm:p-10 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-xl shadow-slate-200/50 dark:shadow-none animate-in fade-in slide-in-from-right-8 duration-700">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Send a Message</h3>
                    <p className="text-slate-500 text-sm mb-8">We usually respond within 24 hours.</p>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Your Name</label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="John Doe"
                                className="h-14 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-slate-800"
                                {...formik.getFieldProps('name')}
                            />
                            {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs font-bold pl-1">{formik.errors.name}</div> : null}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                className="h-14 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-slate-800"
                                {...formik.getFieldProps('email')}
                            />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs font-bold pl-1">{formik.errors.email}</div> : null}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="How can we help you?"
                                className="min-h-[150px] bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-slate-800 resize-none p-4"
                                {...formik.getFieldProps('message')}
                            />
                            {formik.touched.message && formik.errors.message ? <div className="text-red-500 text-xs font-bold pl-1">{formik.errors.message}</div> : null}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] transition-transform"
                        >
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ContactUs;

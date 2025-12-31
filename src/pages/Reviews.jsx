import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '@/api/axios';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/AuthContext';

const Reviews = () => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await API.get('/reviews');
            setReviews(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch reviews", error);
            setLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            rating: 5,
            message: ''
        },
        validationSchema: Yup.object({
            rating: Yup.number().min(1).max(5).required('Rating is required'),
            message: Yup.string().required('Please share your experience'),
        }),
        onSubmit: async (values, { resetForm }) => {
            if (!user) {
                setSubmitError("Please login to leave a review.");
                return;
            }
            try {
                setSubmitError('');
                await API.post('/reviews', values);
                setSubmitSuccess(true);
                resetForm();
                fetchReviews(); // Refresh list
                setTimeout(() => setSubmitSuccess(false), 3000);
            } catch (err) {
                setSubmitError(err.response?.data?.message || "Failed to submit review");
            }
        },
    });

    return (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Inter']">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-[#13ec6d] font-black uppercase tracking-widest text-xs mb-2 block">Community Voices</span>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
                    Donor <span className="text-slate-500">Reviews</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg">
                    See what others are saying about their impact with DonationHub.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                    {loading ? (
                        <div className="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Reviews...</div>
                    ) : reviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review) => (
                                <div key={review._id} className="bg-white dark:bg-[#111c16] p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="material-symbols-outlined text-[20px] fill-current">
                                                {i < review.rating ? 'star' : 'star_outline'}
                                            </span>
                                        ))}
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">"{review.message}"</p>
                                    <div className="flex items-center gap-3 border-t border-slate-50 dark:border-slate-800 pt-4">
                                        <div className="size-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center font-black text-xs text-slate-500 uppercase">
                                            {review.user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{review.user?.name || 'Anonymous'}</p>
                                            <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">rate_review</span>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first!</p>
                        </div>
                    )}
                </div>

                {/* Write Review Form */}
                <div className="lg:col-span-1">
                    <div className="bg-[#13ec6d] p-8 rounded-3xl shadow-xl shadow-[#13ec6d]/20 sticky top-24">
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Share Your Story</h3>
                        <p className="text-slate-900/70 text-sm font-medium mb-6">How was your experience donating?</p>

                        {user ? (
                            <form onSubmit={formik.handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/60 ml-1 mb-2 block">Rating</label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => formik.setFieldValue('rating', star)}
                                                className={`size-10 rounded-xl flex items-center justify-center transition-all ${formik.values.rating >= star ? 'bg-white text-amber-500 shadow-lg' : 'bg-white/30 text-slate-900/40 hover:bg-white/50'}`}
                                            >
                                                <span className="material-symbols-outlined fill-current">{formik.values.rating >= star ? 'star' : 'star_outline'}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900/60 ml-1 mb-2 block">Review</label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="Write your review here..."
                                        className="bg-white/50 border-0 focus-visible:ring-0 placeholder:text-slate-900/40 text-slate-900 min-h-[120px]"
                                        {...formik.getFieldProps('message')}
                                    />
                                    {formik.touched.message && formik.errors.message ? <div className="text-red-600 text-xs font-bold pl-1 mt-1">{formik.errors.message}</div> : null}
                                </div>

                                {submitError && <div className="text-red-600 text-xs font-bold">{submitError}</div>}
                                {submitSuccess && <div className="text-slate-900 text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Review submitted!</div>}

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-slate-900 text-white font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                                >
                                    Submit Review
                                </Button>
                            </form>
                        ) : (
                            <div className="bg-white/20 rounded-2xl p-6 text-center">
                                <span className="material-symbols-outlined text-3xl text-slate-900 mb-2">lock</span>
                                <p className="text-slate-900 font-bold text-sm mb-4">Please sign in to leave a review.</p>
                                <Button onClick={() => window.location.href = '/login'} className="w-full bg-white text-slate-900 font-bold uppercase text-xs tracking-widest hover:bg-white/90">
                                    Sign In
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Reviews;

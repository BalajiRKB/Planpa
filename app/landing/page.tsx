'use client';

import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-gray-800">PlanPA</h1>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-gray-700 hover:text-gray-900 transition"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Sign Up
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-gray-800 mb-6">
            Plan Your Perfect Day
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Balance work and rest with research-backed 40-minute work blocks and 5-minute breaks.
            Boost your productivity while maintaining focus and energy.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-800 text-lg font-semibold rounded-lg transition shadow-lg border border-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Task Management</h3>
            <p className="text-gray-600">
              Organize tasks with priorities (P1-P4), durations, and categories. Eisenhower matrix visualization included.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Scheduling</h3>
            <p className="text-gray-600">
              Auto-generate schedules with 40-minute work blocks and 5-minute breaks. Drag and drop tasks to plan your day.
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Track your productivity with real-time metrics, completion rates, and insights to improve your workflow.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h3 className="text-4xl font-bold text-gray-800 text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Add Tasks</h4>
              <p className="text-gray-600 text-sm">Create your task list with priorities and durations</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Create Schedule</h4>
              <p className="text-gray-600 text-sm">Generate your daily schedule with work blocks</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Drag & Drop</h4>
              <p className="text-gray-600 text-sm">Assign tasks to time blocks with simple drag & drop</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Start Working</h4>
              <p className="text-gray-600 text-sm">Use the timer to stay focused and track progress</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center bg-white rounded-2xl p-12 shadow-xl">
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to boost your productivity?
          </h3>
          <p className="text-gray-600 mb-8">
            Join thousands of users who are planning better and achieving more.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition shadow-lg"
          >
            Start Planning Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">© 2025 PlanPA. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-gray-800">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

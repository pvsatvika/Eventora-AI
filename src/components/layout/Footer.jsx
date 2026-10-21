import React from 'react';
import { Link } from 'react-router-dom';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-stoneborder mt-24 py-16 text-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-stoneborder">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Link to="/" className="inline-block font-editorial text-2xl font-semibold tracking-tight text-charcoal">
              Eventora
            </Link>
            <p className="text-sm text-muted max-w-sm leading-relaxed">
              Thoughtful event planning companion designed for weddings, milestone birthdays, and community gatherings.
            </p>
            <p className="text-xs text-muted pt-2">
              Indian Rupee (INR) native budgeting and local data persistence.
            </p>
          </div>

          {/* Celebrations */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-4">
              Celebrations
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/create" className="hover:text-charcoal transition-colors">
                  Weddings & Receptions
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-charcoal transition-colors">
                  Milestone Birthdays
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-charcoal transition-colors">
                  Community Festivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Planning Suite */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-4">
              Workspace
            </h4>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link to="/dashboard" className="hover:text-charcoal transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/budget" className="hover:text-charcoal transition-colors">
                  Budget Planner
                </Link>
              </li>
              <li>
                <Link to="/timeline" className="hover:text-charcoal transition-colors">
                  Timeline & Tasks
                </Link>
              </li>
              <li>
                <Link to="/vendors" className="hover:text-charcoal transition-colors">
                  Vendor Checklist
                </Link>
              </li>
              <li>
                <Link to="/ideas" className="hover:text-charcoal transition-colors">
                  Creative Ideas
                </Link>
              </li>
            </ul>
          </div>

          {/* About / Integrity */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal mb-4">
              Crafted With Care
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              Built with client-side privacy, persistent local state, and tailored for graceful event hosting.
            </p>
            <div className="mt-4">
              <Link
                to="/events"
                className="text-xs font-medium text-sage-800 hover:underline"
              >
                Manage Saved Celebrations →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
          <p>© {CURRENT_YEAR} Eventora. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Hack2Skill PromptWars Challenge 5</span>
            <span>•</span>
            <span>DM Sans & Playfair Display</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
